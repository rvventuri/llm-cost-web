import { CalendarDays, Clock, Tag, ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { blogArticles } from './data'
import { Route as BlogPostRoute } from '@/routes/blog.$slug'

export function BlogPostPage() {
  const { slug } = (BlogPostRoute as any).useParams() as { slug: string }
  const article = blogArticles.find((a) => a.slug === slug)

  if (!article) {
    // Let TanStack Router handle 404 via notFoundComponent
    throw new Error('Article not found')
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto px-4'>
          <div className='flex h-16 items-center justify-between'>
            <Link to='/' className='flex items-center space-x-2'>
              <div className='text-lg font-medium tracking-tight'>LLM Cost Radar</div>
            </Link>

            <nav className='flex items-center gap-4 text-sm font-light'>
              <Link
                to={'/documentation' as any}
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                Documentation
              </Link>
              <Link
                to={'/blog' as any}
                className='text-foreground font-normal'
              >
                Blog
              </Link>
              <div className='flex items-center gap-2'>
                <Button asChild variant='ghost' size='sm' className='font-light'>
                  <Link to={'/sign-in' as any}>Sign in</Link>
                </Button>
                <Button asChild size='sm' className='font-light rounded-full'>
                  <Link to={'/sign-up' as any}>Create account</Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Article header */}
      <section className='border-b bg-muted/20'>
        <div className='container mx-auto px-4 py-10'>
          <div className='max-w-3xl mx-auto space-y-6'>
            <div>
              <Button
                asChild
                variant='ghost'
                size='sm'
                className='px-0 text-xs font-light text-muted-foreground hover:text-foreground'
              >
                <Link to={'/blog' as any}>
                  <ArrowLeft className='mr-2 h-3.5 w-3.5' />
                  Back to blog
                </Link>
              </Button>
            </div>

            <Badge
              variant='outline'
              className='px-3 py-1.5 text-[11px] font-normal border-primary/20 bg-background/50'
            >
              LLM costs · FinOps
            </Badge>

            <h1 className='text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-tight'>
              {article.title}
            </h1>

            <p className='text-base sm:text-lg text-muted-foreground font-light leading-relaxed'>
              {article.description}
            </p>

            <div className='flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-light'>
              <span className='inline-flex items-center gap-1'>
                <CalendarDays className='h-3.5 w-3.5' />
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span className='inline-flex items-center gap-1'>
                <Clock className='h-3.5 w-3.5' />
                {article.readingTimeMinutes} min read
              </span>
              <span className='inline-flex items-center gap-1'>
                <Tag className='h-3.5 w-3.5' />
                {article.heroTag}
              </span>
            </div>

            <div className='flex flex-wrap gap-1.5'>
              {article.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className='rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground'
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Article content */}
      <main className='container mx-auto px-4 py-12'>
        <article className='max-w-3xl mx-auto space-y-10 text-sm sm:text-base leading-relaxed font-light text-muted-foreground'>
          {article.sections.map((section, sectionIndex) => (
            <div key={section.heading} className='space-y-8'>
              <section className='space-y-3'>
                <h2 className='text-xl sm:text-2xl font-medium tracking-tight text-foreground'>
                  {section.heading}
                </h2>
                {section.body.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </section>

              {/* Mid-article CTA after the second section */}
              {sectionIndex === 1 && (
                <section className='p-6 rounded-lg border bg-muted/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-foreground'>
                      Ready to get real visibility into your LLM costs?
                    </p>
                    <p>
                      Create a free LLM Cost Radar account and see the same kind of breakdowns
                      described in this article — by feature, model, provider and tags.
                    </p>
                  </div>
                  <Button
                    asChild
                    size='sm'
                    className='shrink-0 rounded-full px-6'
                  >
                    <Link to={'/sign-up' as any}>
                      Create free account
                      <ArrowLeft className='hidden' />
                    </Link>
                  </Button>
                </section>
              )}
            </div>
          ))}

          <section className='mt-8 p-6 rounded-lg border-l-4 border-primary bg-primary/5 space-y-2'>
            <p className='text-sm font-medium text-foreground'>
              Turn these ideas into real LLM FinOps visibility.
            </p>
            <p>
              LLM Cost Radar gives you real-time dashboards, rankings and budgets over the exact
              concepts described in this article: provider, model, feature and tags. Start by
              sending a single HTTP event and build your cost practice from there.
            </p>
          </section>
        </article>
      </main>

      {/* Footer */}
      <footer className='py-12 border-t'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-light'>
            <p>© 2024 LLM Cost Radar</p>
            <div className='flex gap-6'>
              <Link to='/' className='hover:text-foreground transition-colors'>
                Home
              </Link>
              <Link to={'/documentation' as any} className='hover:text-foreground transition-colors'>
                Documentation
              </Link>
              <Link to={'/blog' as any} className='hover:text-foreground transition-colors'>
                Blog
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

