import Discord, {
  Interaction,
  GuildMember,
  Snowflake,
  Guild,
} from "discord.js";
import {
  AudioPlayerStatus,
  AudioResource,
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { Track } from "./music/track";
import { MusicSubscription } from "./music/subscription";
import ytdl from "ytdl-core";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const yts = require("yt-search");

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const { token } = require("./auth.json");

const Client = new Discord.Client({
  intents: ["GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILDS"],
});

Client.on("ready", () =>
  console.log(`Ready, logged in as ${Client.user?.tag}`)
);

// This contains the setup code for creating slash commands in a guild. The owner of the bot can send "!deploy" to create them.
Client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (!Client.application?.owner) await Client.application?.fetch();

  if (
    message.content.toLowerCase() === "!deploy" &&
    message.author.id === Client.application?.owner?.id
  ) {
    await message.guild.commands.set([
      {
        name: "play",
        description: "Plays a song",
        options: [
          {
            name: "song",
            type: "STRING" as const,
            description: "The URL or the name of the song to play",
            required: true,
          },
        ],
      },
      {
        name: "download",
        description: "Gets an MP3 of a song",
        options: [
          {
            name: "song",
            type: "STRING" as const,
            description: "The URL or the name of the song to get",
            required: true,
          },
        ],
      },
      {
        name: "skip",
        description: "Skip to the next song in the queue",
      },
      {
        name: "queue",
        description: "See the music queue",
      },
      {
        name: "pause",
        description: "Pauses the song that is currently playing",
      },
      {
        name: "resume",
        description: "Resume playback of the current song",
      },
      {
        name: "stop",
        description: "Leave the voice channel",
      },
    ]);

    await message.reply("Deployed!");
  }
});

/**
 * Maps guild IDs to music subscriptions, which exist if the bot has an active VoiceConnection to the guild.
 */
const subscriptions = new Map<Snowflake, MusicSubscription>();

// Handles slash command interactions
Client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isCommand() || !interaction.guildId) return;
  let subscription = subscriptions.get(interaction.guildId);

  if (interaction.commandName === "play") {
    await interaction.deferReply();
    // Extract the video URL from the command
    var url = interaction.options.get("song")!.value! as string;

    // If a connection to the guild doesn't already exist and the user is in a voice channel, join that channel
    // and create a subscription.
    if (!subscription) {
      if (
        interaction.member instanceof GuildMember &&
        interaction.member.voice.channel
      ) {
        const channel = interaction.member.voice.channel;
        subscription = new MusicSubscription(
          joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
          })
        );
        subscription.voiceConnection.on("error", console.warn);
        subscriptions.set(interaction.guildId, subscription);
      }
    }

    // If there is no subscription, tell the user they need to join a channel.
    if (!subscription) {
      await interaction.followUp(
        "Join a voice channel and then try that again!"
      );
      return;
    }

    // Make sure the connection is ready before processing the user's request
    try {
      await entersState(
        subscription.voiceConnection,
        VoiceConnectionStatus.Ready,
        20e3
      );
    } catch (error) {
      console.warn(error);
      await interaction.followUp(
        "Failed to join voice channel within 20 seconds, please try again later!"
      );
      return;
    }

    try {
      // Attempt to create a Track from the user's video URL
      // if the video isn't a URL

      if (!ytdl.validateURL(url)) {
        const r = await yts(url);
        url = r.videos[0].url;
      }

      const trackData = await (await ytdl.getBasicInfo(url)).videoDetails;

      const track = await Track.from(url, {
        onStart() {
          interaction
            .followUp({
              embeds: [
                new Discord.MessageEmbed()
                  .setTitle("Now Playing!")
                  .addField(
                    trackData.title,
                    (trackData.description?.length ?? 0) > 1024
                      ? trackData.description?.slice(0, 1021) + "..."
                      : trackData.description ?? "No Description"
                  )
                  .setDescription(
                    `${trackData.viewCount} views | ${trackData.author.name} | ${trackData.publishDate}`
                  )
                  .setImage(trackData.thumbnails[0].url)
                  .setThumbnail(
                    trackData.author.thumbnails
                      ? trackData.author.thumbnails[0].url
                      : interaction.user.avatarURL() ??
                          Client.user?.avatarURL() ??
                          ""
                  )
                  .setColor(interaction.user.hexAccentColor ?? "#000000"),
              ],
            })
            .catch(console.warn);
        },
        onFinish() {
          interaction
            .followUp({ content: "Now finished!" })
            .catch(console.warn);
        },
        onError(error) {
          console.warn(error);
          interaction
            .followUp({ content: `Error: ${error.message}` })
            .catch(console.warn);
        },
      });
      // Enqueue the track and reply a success message to the user
      subscription.enqueue(track);
      await interaction.followUp(`Queued **${track.title}** | ${track.length}`);
    } catch (error) {
      console.warn(error);
      await interaction.reply("Failed to play track, please try again later!");
    }
  } else if (interaction.commandName === "skip") {
    if (subscription) {
      // Calling .stop() on an AudioPlayer causes it to transition into the Idle state. Because of a state transition
      // listener defined in music/subscription.ts, transitions into the Idle state mean the next track from the queue
      // will be loaded and played.
      subscription.audioPlayer.stop();
      await interaction.reply("Skipped song!");
    } else {
      await interaction.reply("Not playing in this server!");
    }
  } else if (interaction.commandName === "queue") {
    // Print out the current queue, including up to the next 5 tracks to be played.
    if (subscription) {
      const current =
        subscription.audioPlayer.state.status === AudioPlayerStatus.Idle
          ? `Nothing is currently playing!`
          : `Playing **${
              (subscription.audioPlayer.state.resource as AudioResource<Track>)
                .metadata.title
            }** | ${
              (subscription.audioPlayer.state.resource as AudioResource<Track>)
                .metadata.length
            }`;

      const queue = subscription.queue
        .slice(0, 5)
        .map(
          (track, index) => `${index + 1} | ${track.title} | ${track.length}`
        )
        .join("\n");

      await interaction.reply(`${current}\n\n${queue}`);
    } else {
      await interaction.reply("Not playing in this server!");
    }
  } else if (interaction.commandName === "pause") {
    if (subscription) {
      subscription.audioPlayer.pause();
      await interaction.reply({ content: `Paused!` });
    } else {
      await interaction.reply("Not playing in this server!");
    }
  } else if (interaction.commandName === "resume") {
    if (subscription) {
      subscription.audioPlayer.unpause();
      await interaction.reply({ content: `Unpaused!` });
    } else {
      await interaction.reply("Not playing in this server!");
    }
  } else if (interaction.commandName === "stop") {
    if (subscription) {
      subscription.voiceConnection.destroy();
      subscriptions.delete(interaction.guildId);
      await interaction.reply({ content: `Left channel!` });
    } else {
      await interaction.reply("Not playing in this server!");
    }
  } else if (interaction.commandName === "download") {
    await interaction.deferReply();
    // Extract the video URL from the command
    var url = interaction.options.get("song")!.value! as string;

    if (!ytdl.validateURL(url)) {
      const r = await yts(url);
      url = r.videos[0].url;
    }

	interaction.followUp({content: "Downloading..."})
    const trackData = await await ytdl.getBasicInfo(url);
	const attatch = new Discord.MessageAttachment(ytdl(url, {filter: "audioonly"}), `${trackData.videoDetails.title}.mp3`)
	interaction.channel?.send({files: [attatch]})
	
  } else {
    await interaction.reply("Unknown command");
  }
});

Client.on("error", console.warn);

void Client.login(token);
