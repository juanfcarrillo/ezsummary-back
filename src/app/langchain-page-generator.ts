import { PageGenerator } from "./page-generator";
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { env } from 'hono/adapter'

export class LangchainPageGenerator implements PageGenerator {
    private model: ChatGoogleGenerativeAI;
    private summaryChain: RunnableSequence;
    private tagChain: RunnableSequence;
    constructor(google_api_key: string) {


        this.model = new ChatGoogleGenerativeAI({
            model: "gemini-2.0-flash",
            apiKey: google_api_key
        });

        // Create the summary chain
        const summaryPrompt = PromptTemplate.fromTemplate(
            `As a expert note taker, create a summary or take a note of the following content.
            Considerations:
            - Take into account that the note has to be concise and to the point.
            - The note should be written in a way that is easy to understand.
            - The note should be written in a way that is easy to read.
            - The note should be written in a way that is easy to remember.
            - The note has to be relevant to the content.
            
            Content:

            {content}
            
            Summary:`
        );

        this.summaryChain = RunnableSequence.from([
            summaryPrompt,
            this.model,
        ]);

        // Create the tag generation chain
        const tagPrompt = PromptTemplate.fromTemplate(
            `Given the following summary and previous tags, generate relevant tags for the content.
            Previous tags: {previousTags}
            Summary: {summary}
            
            Generate 3-5 relevant tags, separated by commas:`
        );

        this.tagChain = RunnableSequence.from([
            tagPrompt,
            this.model,
        ]);
    }

    async generateWithPreviousTags(previousTags: string[], content: string): Promise<string> {
        // First generate a summary
        const summary = await this.summaryChain.invoke({
            content: content
        });

        // Then generate tags based on the summary and previous tags
        const tags = await this.tagChain.invoke({
            previousTags: previousTags,
            summary: summary
        });

        return `${summary.content}\n${tags.content.split(',').map((tag: string) => `#${tag}`).join(' ')}`;
    }
}