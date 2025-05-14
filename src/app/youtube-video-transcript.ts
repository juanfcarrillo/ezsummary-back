import { InputVideoTranscript } from "./input-video-transcript";
import { YoutubeTranscript } from 'youtube-transcript';

export class YoutubeVideoTranscript implements InputVideoTranscript {
    async getTranscript(videoId: string): Promise<string> {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId)
        return transcript.map(transcript => transcript.text).join(" ")
    }
}