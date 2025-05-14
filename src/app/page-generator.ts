export interface PageGenerator {
    generateWithPreviousTags(previousTags: string[], content: string): Promise<string>
}