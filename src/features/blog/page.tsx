import { ArrowRight, CalendarDays, Clock } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { blogArticles } from './data'

export function BlogPage() {
  const sorted = [...blogArticles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )

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

      {/* Article list */}
      <section className='py-16 border-b'>
        <div className='container mx-auto px-4'>
          <div className='max-w-5xl mx-auto space-y-8'>
            <div className='flex items-center justify-between'>
              <h2 className='text-2xl sm:text-3xl font-light tracking-tight'>
                Latest articles on LLM costs
              </h2>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
              {sorted.map((article) => (
                <Link
                  key={article.slug}
                  to={`/blog/${article.slug}` as any}
                  className='group flex flex-col justify-between rounded-lg border bg-background p-5 hover:border-primary/50 hover:bg-muted/40 transition-colors'
                >
                  <div className='space-y-3'>
                    <div className='flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-light'>
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
                    </div>
                    <h3 className='text-lg font-medium group-hover:text-primary transition-colors'>
                      {article.title}
                    </h3>
                    <p className='text-sm text-muted-foreground font-light leading-relaxed line-clamp-3'>
                      {article.description}
                    </p>
                  </div>
                  <div className='mt-4 flex items-center justify-between text-xs text-muted-foreground font-light'>
                    <div className='flex flex-wrap gap-1.5'>
                      {article.keywords.slice(0, 3).map((keyword) => (
                        <span
                          key={keyword}
                          className='rounded-full bg-muted px-2 py-0.5 text-[11px]'
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <span className='inline-flex items-center gap-1 text-[11px]'>
                      Read more
                      <ArrowRight className='h-3 w-3' />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

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

