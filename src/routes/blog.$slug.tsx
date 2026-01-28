import { createFileRoute } from '@tanstack/react-router'
import { BlogPostPage } from '@/features/blog/post-page'

export const Route = createFileRoute('/blog/$slug' as any)({
  component: BlogPostPage,
})

