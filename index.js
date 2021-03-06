"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = __importStar(require("discord.js"));
var voice_1 = require("@discordjs/voice");
var track_1 = require("./music/track");
var subscription_1 = require("./music/subscription");
var ytdl_core_1 = __importDefault(require("ytdl-core"));
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
var yts = require("yt-search");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var token = process.env.TOKEN;
var Client = new discord_js_1.default.Client({
    intents: ["GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILDS"],
});
Client.on("ready", function () { var _a; return console.log("Ready, logged in as " + ((_a = Client.user) === null || _a === void 0 ? void 0 : _a.tag)); });
// This contains the setup code for creating slash commands in a guild. The owner of the bot can send "!deploy" to create them.
Client.on("messageCreate", function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (!message.guild)
                    return [2 /*return*/];
                if (!!((_a = Client.application) === null || _a === void 0 ? void 0 : _a.owner)) return [3 /*break*/, 2];
                return [4 /*yield*/, ((_b = Client.application) === null || _b === void 0 ? void 0 : _b.fetch())];
            case 1:
                _e.sent();
                _e.label = 2;
            case 2:
                if (!(message.content.toLowerCase() === "!deploy" &&
                    message.author.id === ((_d = (_c = Client.application) === null || _c === void 0 ? void 0 : _c.owner) === null || _d === void 0 ? void 0 : _d.id))) return [3 /*break*/, 5];
                return [4 /*yield*/, message.guild.commands.set([
                        {
                            name: "play",
                            description: "Plays a song",
                            options: [
                                {
                                    name: "song",
                                    type: "STRING",
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
                                    type: "STRING",
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
                    ])];
            case 3:
                _e.sent();
                return [4 /*yield*/, message.reply("Deployed!")];
            case 4:
                _e.sent();
                _e.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * Maps guild IDs to music subscriptions, which exist if the bot has an active VoiceConnection to the guild.
 */
var subscriptions = new Map();
// Handles slash command interactions
Client.on("interactionCreate", function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var subscription, url, channel, error_1, r, trackData_1, track, error_2, current, queue, url, r, trackData, attatch;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!interaction.isCommand() || !interaction.guildId)
                    return [2 /*return*/];
                subscription = subscriptions.get(interaction.guildId);
                if (!(interaction.commandName === "play")) return [3 /*break*/, 17];
                return [4 /*yield*/, interaction.deferReply()];
            case 1:
                _b.sent();
                url = interaction.options.get("song").value;
                // If a connection to the guild doesn't already exist and the user is in a voice channel, join that channel
                // and create a subscription.
                if (!subscription) {
                    if (interaction.member instanceof discord_js_1.GuildMember &&
                        interaction.member.voice.channel) {
                        channel = interaction.member.voice.channel;
                        subscription = new subscription_1.MusicSubscription((0, voice_1.joinVoiceChannel)({
                            channelId: channel.id,
                            guildId: channel.guild.id,
                            adapterCreator: channel.guild.voiceAdapterCreator,
                        }));
                        subscription.voiceConnection.on("error", console.warn);
                        subscriptions.set(interaction.guildId, subscription);
                    }
                }
                if (!!subscription) return [3 /*break*/, 3];
                return [4 /*yield*/, interaction.followUp("Join a voice channel and then try that again!")];
            case 2:
                _b.sent();
                return [2 /*return*/];
            case 3:
                _b.trys.push([3, 5, , 7]);
                return [4 /*yield*/, (0, voice_1.entersState)(subscription.voiceConnection, voice_1.VoiceConnectionStatus.Ready, 20e3)];
            case 4:
                _b.sent();
                return [3 /*break*/, 7];
            case 5:
                error_1 = _b.sent();
                console.warn(error_1);
                return [4 /*yield*/, interaction.followUp("Failed to join voice channel within 20 seconds, please try again later!")];
            case 6:
                _b.sent();
                return [2 /*return*/];
            case 7:
                _b.trys.push([7, 14, , 16]);
                if (!!ytdl_core_1.default.validateURL(url)) return [3 /*break*/, 9];
                return [4 /*yield*/, yts(url)];
            case 8:
                r = _b.sent();
                url = r.videos[0].url;
                _b.label = 9;
            case 9: return [4 /*yield*/, ytdl_core_1.default.getBasicInfo(url)];
            case 10: return [4 /*yield*/, (_b.sent()).videoDetails];
            case 11:
                trackData_1 = _b.sent();
                return [4 /*yield*/, track_1.Track.from(url, {
                        onStart: function () {
                            var _a, _b, _c, _d, _e, _f, _g, _h;
                            interaction
                                .followUp({
                                embeds: [
                                    new discord_js_1.default.MessageEmbed()
                                        .setTitle("Now Playing!")
                                        .addField(trackData_1.title, ((_b = (_a = trackData_1.description) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 1024
                                        ? ((_c = trackData_1.description) === null || _c === void 0 ? void 0 : _c.slice(0, 1021)) + "..."
                                        : (_d = trackData_1.description) !== null && _d !== void 0 ? _d : "No Description")
                                        .setDescription(trackData_1.viewCount + " views | " + trackData_1.author.name + " | " + trackData_1.publishDate)
                                        .setImage(trackData_1.thumbnails[0].url)
                                        .setThumbnail(trackData_1.author.thumbnails
                                        ? trackData_1.author.thumbnails[0].url
                                        : (_g = (_e = interaction.user.avatarURL()) !== null && _e !== void 0 ? _e : (_f = Client.user) === null || _f === void 0 ? void 0 : _f.avatarURL()) !== null && _g !== void 0 ? _g : "")
                                        .setColor((_h = interaction.user.hexAccentColor) !== null && _h !== void 0 ? _h : "#000000"),
                                ],
                            })
                                .catch(console.warn);
                        },
                        onFinish: function () {
                            interaction
                                .followUp({ content: "Now finished!" })
                                .catch(console.warn);
                        },
                        onError: function (error) {
                            console.warn(error);
                            interaction
                                .followUp({ content: "Error: " + error.message })
                                .catch(console.warn);
                        },
                    })];
            case 12:
                track = _b.sent();
                // Enqueue the track and reply a success message to the user
                subscription.enqueue(track);
                return [4 /*yield*/, interaction.followUp("Queued **" + track.title + "** | " + track.length)];
            case 13:
                _b.sent();
                return [3 /*break*/, 16];
            case 14:
                error_2 = _b.sent();
                console.warn(error_2);
                return [4 /*yield*/, interaction.reply("Failed to play track, please try again later!")];
            case 15:
                _b.sent();
                return [3 /*break*/, 16];
            case 16: return [3 /*break*/, 50];
            case 17:
                if (!(interaction.commandName === "skip")) return [3 /*break*/, 22];
                if (!subscription) return [3 /*break*/, 19];
                // Calling .stop() on an AudioPlayer causes it to transition into the Idle state. Because of a state transition
                // listener defined in music/subscription.ts, transitions into the Idle state mean the next track from the queue
                // will be loaded and played.
                subscription.audioPlayer.stop();
                return [4 /*yield*/, interaction.reply("Skipped song!")];
            case 18:
                _b.sent();
                return [3 /*break*/, 21];
            case 19: return [4 /*yield*/, interaction.reply("Not playing in this server!")];
            case 20:
                _b.sent();
                _b.label = 21;
            case 21: return [3 /*break*/, 50];
            case 22:
                if (!(interaction.commandName === "queue")) return [3 /*break*/, 27];
                if (!subscription) return [3 /*break*/, 24];
                current = subscription.audioPlayer.state.status === voice_1.AudioPlayerStatus.Idle
                    ? "Nothing is currently playing!"
                    : "Playing **" + subscription.audioPlayer.state.resource
                        .metadata.title + "** | " + subscription.audioPlayer.state.resource
                        .metadata.length;
                queue = subscription.queue
                    .slice(0, 5)
                    .map(function (track, index) { return index + 1 + " | " + track.title + " | " + track.length; })
                    .join("\n");
                return [4 /*yield*/, interaction.reply(current + "\n\n" + queue)];
            case 23:
                _b.sent();
                return [3 /*break*/, 26];
            case 24: return [4 /*yield*/, interaction.reply("Not playing in this server!")];
            case 25:
                _b.sent();
                _b.label = 26;
            case 26: return [3 /*break*/, 50];
            case 27:
                if (!(interaction.commandName === "pause")) return [3 /*break*/, 32];
                if (!subscription) return [3 /*break*/, 29];
                subscription.audioPlayer.pause();
                return [4 /*yield*/, interaction.reply({ content: "Paused!" })];
            case 28:
                _b.sent();
                return [3 /*break*/, 31];
            case 29: return [4 /*yield*/, interaction.reply("Not playing in this server!")];
            case 30:
                _b.sent();
                _b.label = 31;
            case 31: return [3 /*break*/, 50];
            case 32:
                if (!(interaction.commandName === "resume")) return [3 /*break*/, 37];
                if (!subscription) return [3 /*break*/, 34];
                subscription.audioPlayer.unpause();
                return [4 /*yield*/, interaction.reply({ content: "Unpaused!" })];
            case 33:
                _b.sent();
                return [3 /*break*/, 36];
            case 34: return [4 /*yield*/, interaction.reply("Not playing in this server!")];
            case 35:
                _b.sent();
                _b.label = 36;
            case 36: return [3 /*break*/, 50];
            case 37:
                if (!(interaction.commandName === "stop")) return [3 /*break*/, 42];
                if (!subscription) return [3 /*break*/, 39];
                subscription.voiceConnection.destroy();
                subscriptions.delete(interaction.guildId);
                return [4 /*yield*/, interaction.reply({ content: "Left channel!" })];
            case 38:
                _b.sent();
                return [3 /*break*/, 41];
            case 39: return [4 /*yield*/, interaction.reply("Not playing in this server!")];
            case 40:
                _b.sent();
                _b.label = 41;
            case 41: return [3 /*break*/, 50];
            case 42:
                if (!(interaction.commandName === "download")) return [3 /*break*/, 48];
                return [4 /*yield*/, interaction.deferReply()];
            case 43:
                _b.sent();
                url = interaction.options.get("song").value;
                if (!!ytdl_core_1.default.validateURL(url)) return [3 /*break*/, 45];
                return [4 /*yield*/, yts(url)];
            case 44:
                r = _b.sent();
                url = r.videos[0].url;
                _b.label = 45;
            case 45:
                interaction.followUp({ content: "Downloading..." });
                return [4 /*yield*/, ytdl_core_1.default.getBasicInfo(url)];
            case 46: return [4 /*yield*/, _b.sent()];
            case 47:
                trackData = _b.sent();
                attatch = new discord_js_1.default.MessageAttachment((0, ytdl_core_1.default)(url, { filter: "audioonly" }), trackData.videoDetails.title + ".mp3");
                (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({ files: [attatch] });
                return [3 /*break*/, 50];
            case 48: return [4 /*yield*/, interaction.reply("Unknown command")];
            case 49:
                _b.sent();
                _b.label = 50;
            case 50: return [2 /*return*/];
        }
    });
}); });
Client.on("error", console.warn);
void Client.login(token);
