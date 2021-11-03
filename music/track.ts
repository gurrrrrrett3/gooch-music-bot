import { getInfo } from "ytdl-core";
import {
  AudioResource,
  createAudioResource,
  demuxProbe,
} from "@discordjs/voice";
import { raw as ytdl } from "youtube-dl-exec";

const yts = require("yt-search")

/**
 * This is the data required to create a Track object
 */
export interface TrackData {
  url: string;
  searchTerm: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => { };

/**
 * A Track represents information about a YouTube video (in this context) that can be added to a queue.
 * It contains the title and URL of the video, as well as functions onStart, onFinish, onError, that act
 * as callbacks that are triggered at certain points during the track's lifecycle.
 *
 * Rather than creating an AudioResource for each video immediately and then keeping those in a queue,
 * we use tracks as they don't pre-emptively load the videos. Instead, once a Track is taken from the
 * queue, it is converted into an AudioResource just in time for playback.
 */
export class Track implements TrackData {
  public url: string;
  public searchTerm: string;
  public trackData: any

  private constructor({
    url,
    searchTerm
  }: TrackData) {
    this.url = url;
    this.searchTerm = searchTerm;
    this.trackData = undefined;
  }

  /**
   * Creates an AudioResource from this Track.
   */
  public async createAudioResource(): Promise<AudioResource<Track>> {
    return new Promise(async (resolve, reject) => {
      if (!this.url) {
        const r = await yts(this.searchTerm)
        this.url = r.videos[0].url;
      }
      const process = ytdl(
        this.url,
        {
          o: "-",
          q: "",
          f: "bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio",
          r: "100K",
        },
        { stdio: ["ignore", "pipe", "ignore"] }
      );
      if (!process.stdout) {
        reject(new Error("No stdout"));
        return;
      }
      const stream = process.stdout;
      const onError = (error: Error) => {
        if (!process.killed) process.kill();
        stream.resume();
        reject(error);
      };
      process
        .once("spawn", () => {
          demuxProbe(stream)
            .then((probe) =>
              resolve(
                createAudioResource(probe.stream, {
                  metadata: this,
                  inputType: probe.type,
                })
              )
            )
            .catch(onError);
        })
        .catch(onError);
    });
  }

  /**
   * Creates a Track from a video URL and lifecycle callback methods.
   *
   * @param url The URL of the video
   * @param methods Lifecycle callbacks
   * @returns The created Track
   */
  public static async from(
    url: string
  ): Promise<Track> {
    const info = await getInfo(url);
    return new Track({url, searchTerm = ""})
  }
}

function formatTime(time: string | number) {
  time = parseInt(time.toString());

  const h = Math.floor(time / 3600);
  time = time % 3600;
  const m = Math.floor(time / 60);
  time = time % 60;

  return h > 0 ? `${p(h)}:${p(m)}:${p(time)}` : m > 0 ? `${p(m)}:${p(time)}` : `${p(time)}`;
}

function p(s: number) {
  return s.toString().length == 1 ? `0${s}` : s;
