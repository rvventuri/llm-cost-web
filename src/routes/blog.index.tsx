import { createFileRoute } from '@tanstack/react-router'
import { BlogPage } from '@/features/blog/page'

export const Route = createFileRoute('/blog/' as any)({
  component: BlogPage,
})

