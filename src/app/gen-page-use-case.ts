import { InputVideoTranscript } from "./input-video-transcript";
import { PageGenerator } from "./page-generator";

export class GenPageUseCase {
    private inputVideoTrancript: InputVideoTranscript
    private pageGenerator: PageGenerator
    constructor (
        inputVideoTrancript: InputVideoTranscript,
        pageGenerator: PageGenerator
    ) {
        this.inputVideoTrancript = inputVideoTrancript
        this.pageGenerator = pageGenerator
    }

    async execute(videoId: string, previousTags: string[]) {
        const transcript = await this.inputVideoTrancript.getTranscript(videoId)
        const page = await this.pageGenerator.generateWithPreviousTags(
            previousTags,
            transcript
        )
        return page
    }
}