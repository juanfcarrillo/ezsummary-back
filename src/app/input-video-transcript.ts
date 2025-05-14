export interface InputVideoTranscript {
    getTranscript(videoId: string): Promise<string>
}