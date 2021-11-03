//@typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports

import Discord from "discord.js"
import Voice from "@discordjs/voice"
import ytdl from "ytdl-core";

const yts = require("yt-search")
const { getData, getPreview, getTracks } = require("spotify-url-info");

import dotenv from "dotenv";

dotenv.config();
const token = process.env.TOKEN;

import { Track } from './music/track';
import { MusicSubscription } from "./music/subscription";


/**
 * Maps guild IDs to music subscriptions, which exist if the bot has an active VoiceConnection to the guild.
 */
 const subscriptions = new Map<Discord.Snowflake, MusicSubscription>();


const Client = new Discord.Client({
    intents: ["GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILDS"],
  });
  
  Client.on("ready", () =>
    console.log(`Ready, logged in as ${Client.user?.tag}`)
  );

  Client.on("messageCreate", async (message) => {
    if (!message.guild) return;

    const content = message.content.toLowerCase()
    const command = alias(content.split(" ")[0].toLowerCase())
    const predicate = content.split(" ").slice(1)

    //COMMAND STRUCTURE

    switch (command) {
        case "PLAY": {

            
            
            break;
        }
        case "QUEUE": {
            
            break
        }
        case "SKIP": {

            break
        }
        case "STOP": {

            break
        }
        case "ERROR": {
            
            break
        }
    }

    //Command Aliases

    

  })

  //FUNCTIONS
  function alias(term:string) {
    const alias = {
        play: ["p", "play", "join"],
        queue: ["q", "queue", "songs", "list"],
        stop: ["stop", "end", "leave"],
        skip: ["s", "skip", "next"]
    }

    if (alias.play.includes(term)) {
        return "PLAY"
    } else if (alias.queue.includes(term)) {
        return "QUEUE"
    } else if (alias.skip.includes(term)) {
        return "SKIP"
    } else if (alias.stop.includes(term)) {
        return "STOP"
    } else return "ERROR"
  }


  //CLASSES