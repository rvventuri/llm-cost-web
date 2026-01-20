import { createFileRoute } from '@tanstack/react-router'
import { DashboardLLM } from '@/features/dashboard-llm'

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardLLM,
})
