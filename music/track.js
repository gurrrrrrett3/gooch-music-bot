"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Track = void 0;
var ytdl_core_1 = require("ytdl-core");
var voice_1 = require("@discordjs/voice");
var youtube_dl_exec_1 = require("youtube-dl-exec");
// eslint-disable-next-line @typescript-eslint/no-empty-function
var noop = function () { };
/**
 * A Track represents information about a YouTube video (in this context) that can be added to a queue.
 * It contains the title and URL of the video, as well as functions onStart, onFinish, onError, that act
 * as callbacks that are triggered at certain points during the track's lifecycle.
 *
 * Rather than creating an AudioResource for each video immediately and then keeping those in a queue,
 * we use tracks as they don't pre-emptively load the videos. Instead, once a Track is taken from the
 * queue, it is converted into an AudioResource just in time for playback.
 */
var Track = /** @class */ (function () {
    function Track(_a) {
        var url = _a.url, title = _a.title, length = _a.length, onStart = _a.onStart, onFinish = _a.onFinish, onError = _a.onError;
        this.url = url;
        this.title = title;
        this.length = length;
        this.onStart = onStart;
        this.onFinish = onFinish;
        this.onError = onError;
    }
    /**
     * Creates an AudioResource from this Track.
     */
    Track.prototype.createAudioResource = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var process = (0, youtube_dl_exec_1.raw)(_this.url, {
                o: "-",
                q: "",
                f: "bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio",
                r: "100K",
            }, { stdio: ["ignore", "pipe", "ignore"] });
            if (!process.stdout) {
                reject(new Error("No stdout"));
                return;
            }
            var stream = process.stdout;
            var onError = function (error) {
                if (!process.killed)
                    process.kill();
                stream.resume();
                reject(error);
            };
            process
                .once("spawn", function () {
                (0, voice_1.demuxProbe)(stream)
                    .then(function (probe) {
                    return resolve((0, voice_1.createAudioResource)(probe.stream, {
                        metadata: _this,
                        inputType: probe.type,
                    }));
                })
                    .catch(onError);
            })
                .catch(onError);
        });
    };
    /**
     * Creates a Track from a video URL and lifecycle callback methods.
     *
     * @param url The URL of the video
     * @param methods Lifecycle callbacks
     * @returns The created Track
     */
    Track.from = function (url, methods) {
        return __awaiter(this, void 0, void 0, function () {
            var info, wrappedMethods;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, ytdl_core_1.getInfo)(url)];
                    case 1:
                        info = _a.sent();
                        wrappedMethods = {
                            onStart: function () {
                                wrappedMethods.onStart = noop;
                                methods.onStart();
                            },
                            onFinish: function () {
                                wrappedMethods.onFinish = noop;
                                methods.onFinish();
                            },
                            onError: function (error) {
                                wrappedMethods.onError = noop;
                                methods.onError(error);
                            },
                        };
                        return [2 /*return*/, new Track(__assign({ title: info.videoDetails.title, length: formatTime(info.videoDetails.lengthSeconds), url: url }, wrappedMethods))];
                }
            });
        });
    };
    return Track;
}());
exports.Track = Track;
function formatTime(time) {
    time = parseInt(time.toString());
    var h = Math.floor(time / 3600);
    time = time % 3600;
    var m = Math.floor(time / 60);
    time = time % 60;
    return h > 0 ? p(h) + ":" + p(m) + ":" + p(time) : m > 0 ? p(m) + ":" + p(time) : "" + p(time);
}
function p(s) {
    return s.toString().length == 1 ? "0" + s : s;
}
