import { createFileRoute } from '@tanstack/react-router'
import { TrackLLM } from '@/features/track-llm'

export const Route = createFileRoute('/_authenticated/track-llm/')({
  component: TrackLLM,
})
