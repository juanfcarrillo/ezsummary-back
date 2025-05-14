import { Hono } from 'hono'
import { GenPageUseCase } from './app/gen-page-use-case';
import { YoutubeVideoTranscript } from './app/youtube-video-transcript';
import { LangchainPageGenerator } from './app/langchain-page-generator';

const app = new Hono()

function extractYouTubeId(url: string) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const genPageUseCase = new GenPageUseCase(
  new YoutubeVideoTranscript(),
  new LangchainPageGenerator()
)

app.post('/', async (c) => {
  const { video_url, previous_tags } = await c.req.json()
  const videoId = extractYouTubeId(video_url)

  if (!videoId) {
    return c.json({ error: 'Invalid video URL' })
  }

  const page = await genPageUseCase.execute(videoId, previous_tags)
  
  return c.json(page)
})

export default app
