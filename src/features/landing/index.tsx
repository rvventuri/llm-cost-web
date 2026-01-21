import { ArrowRight, Check, BookOpen, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'
import { OverviewCards } from '@/features/dashboard-llm/components/overview-cards'
import { TimeSeriesChart } from '@/features/dashboard-llm/components/time-series-chart'
import { TopRankings } from '@/features/dashboard-llm/components/top-rankings'
import { BudgetStatusCards } from '@/features/dashboard-llm/components/budget-status-cards'
import type { DashboardData } from '@/lib/dashboard-api'

// Dados fictícios realistas para demonstração
const mockDashboardData: DashboardData = {
  overview: {
    totalCost: 2847.32,
    totalTokens: 12450000,
    totalEvents: 45620,
    averageCostPerEvent: 0.0624,
    period: {
      start: '2024-01-01',
      end: '2024-01-31',
      type: 'monthly',
    },
    trends: {
      costChange: 12.5,
      tokensChange: 8.3,
      eventsChange: 15.2,
    },
  },
  timeSeries: [
    { date: '2024-01-01', cost: 45.23, tokens: 180000, events: 650 },
    { date: '2024-01-02', cost: 52.18, tokens: 210000, events: 720 },
    { date: '2024-01-03', cost: 48.92, tokens: 195000, events: 680 },
    { date: '2024-01-04', cost: 67.45, tokens: 270000, events: 890 },
    { date: '2024-01-05', cost: 89.12, tokens: 355000, events: 1120 },
    { date: '2024-01-06', cost: 95.34, tokens: 380000, events: 1250 },
    { date: '2024-01-07', cost: 102.67, tokens: 410000, events: 1380 },
    { date: '2024-01-08', cost: 98.23, tokens: 392000, events: 1320 },
    { date: '2024-01-09', cost: 87.45, tokens: 350000, events: 1180 },
    { date: '2024-01-10', cost: 91.78, tokens: 367000, events: 1240 },
    { date: '2024-01-11', cost: 105.23, tokens: 421000, events: 1420 },
    { date: '2024-01-12', cost: 112.45, tokens: 450000, events: 1520 },
    { date: '2024-01-13', cost: 108.92, tokens: 436000, events: 1470 },
    { date: '2024-01-14', cost: 125.67, tokens: 503000, events: 1690 },
    { date: '2024-01-15', cost: 118.34, tokens: 473000, events: 1590 },
    { date: '2024-01-16', cost: 134.56, tokens: 538000, events: 1810 },
    { date: '2024-01-17', cost: 142.89, tokens: 572000, events: 1920 },
    { date: '2024-01-18', cost: 138.12, tokens: 553000, events: 1860 },
    { date: '2024-01-19', cost: 145.23, tokens: 581000, events: 1950 },
    { date: '2024-01-20', cost: 152.67, tokens: 611000, events: 2050 },
    { date: '2024-01-21', cost: 148.92, tokens: 596000, events: 2000 },
    { date: '2024-01-22', cost: 156.34, tokens: 625000, events: 2100 },
    { date: '2024-01-23', cost: 162.78, tokens: 651000, events: 2190 },
    { date: '2024-01-24', cost: 158.45, tokens: 634000, events: 2130 },
    { date: '2024-01-25', cost: 165.12, tokens: 661000, events: 2220 },
    { date: '2024-01-26', cost: 172.56, tokens: 690000, events: 2320 },
    { date: '2024-01-27', cost: 168.89, tokens: 676000, events: 2270 },
    { date: '2024-01-28', cost: 175.23, tokens: 701000, events: 2350 },
    { date: '2024-01-29', cost: 182.67, tokens: 731000, events: 2450 },
    { date: '2024-01-30', cost: 178.34, tokens: 713000, events: 2390 },
    { date: '2024-01-31', cost: 185.12, tokens: 741000, events: 2490 },
  ],
  topFeatures: [
    { id: 1, name: 'chat-completion', cost: 1245.67, tokens: 5450000, events: 18920, percentage: 43.8 },
    { id: 2, name: 'document-analysis', cost: 678.92, tokens: 2980000, events: 12340, percentage: 23.9 },
    { id: 3, name: 'code-generation', cost: 523.45, tokens: 2290000, events: 8920, percentage: 18.4 },
    { id: 4, name: 'translation', cost: 234.18, tokens: 1020000, events: 4560, percentage: 8.2 },
    { id: 5, name: 'summarization', cost: 165.10, tokens: 721000, events: 2880, percentage: 5.8 },
  ],
  topTags: [
    { id: 1, name: 'production', cost: 1892.34, tokens: 8290000, events: 31240, percentage: 66.5 },
    { id: 2, name: 'staging', cost: 678.45, tokens: 2970000, events: 11280, percentage: 23.8 },
    { id: 3, name: 'development', cost: 276.53, tokens: 1210000, events: 3100, percentage: 9.7 },
  ],
  topModels: [
    { id: 1, name: 'gpt-4-turbo', cost: 1456.78, tokens: 6380000, events: 18920, percentage: 51.2 },
    { id: 2, name: 'gpt-3.5-turbo', cost: 678.92, tokens: 2970000, events: 15680, percentage: 23.9 },
    { id: 3, name: 'claude-3-opus', cost: 523.45, tokens: 2290000, events: 7820, percentage: 18.4 },
    { id: 4, name: 'claude-3-sonnet', cost: 188.17, tokens: 821000, events: 3200, percentage: 6.6 },
  ],
  topProviders: [
    { id: 1, name: 'OpenAI', cost: 2135.70, tokens: 9350000, events: 34580, percentage: 75.0 },
    { id: 2, name: 'Anthropic', cost: 711.62, tokens: 3110000, events: 11040, percentage: 25.0 },
  ],
  budgetsStatus: [
    {
      budget: {
        id: 1,
        name: 'Budget Mensal Geral',
        amount: 5000,
        type: 'usd',
        period: 'monthly',
      },
      consumption: {
        consumed: 2847.32,
        percentage: 56.9,
        status: 'ok',
        remaining: 2152.68,
      },
    },
    {
      budget: {
        id: 2,
        name: 'Budget GPT-4',
        amount: 2000,
        type: 'usd',
        period: 'monthly',
      },
      consumption: {
        consumed: 1456.78,
        percentage: 72.8,
        status: 'warning',
        remaining: 543.22,
      },
      filter: {
        type: 'model',
        name: 'gpt-4-turbo',
      },
    },
    {
      budget: {
        id: 3,
        name: 'Budget Production',
        amount: 3000,
        type: 'usd',
        period: 'monthly',
      },
      consumption: {
        consumed: 1892.34,
        percentage: 63.1,
        status: 'ok',
        remaining: 1107.66,
      },
      filter: {
        type: 'tag',
        name: 'production',
      },
    },
  ],
}

export function Landing() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Header - Minimalista */}
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto px-4'>
          <div className='flex h-16 items-center justify-between'>
            {/* Logo/Brand */}
            <Link to='/' className='flex items-center space-x-2'>
              <div className='text-lg font-medium tracking-tight'>LLM Cost Radar</div>
            </Link>
            
            {/* Navigation */}
            <nav className='flex items-center gap-4'>
              <Link
                to='/documentation'
                className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-light'
              >
                <BookOpen className='h-4 w-4' />
                Documentation
              </Link>
              
              <div className='flex items-center gap-2'>
                <Button asChild variant='ghost' size='sm' className='font-light'>
                  <Link to='/sign-in'>Sign in</Link>
                </Button>
                <Button asChild size='sm' className='font-light rounded-full'>
                  <Link to='/sign-up'>Create account</Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Focado no produto */}
      <section className='relative border-b'>
        <div className='container mx-auto px-4 py-16'>
          <div className='max-w-4xl mx-auto text-center space-y-6'>
            <Badge 
              variant='outline' 
              className='mb-4 px-4 py-1.5 text-xs font-normal tracking-wide border-primary/20 bg-background/50 backdrop-blur-sm'
            >
              FinOps for LLMs
            </Badge>
            
            <h1 className='text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight'>
              Full visibility into your
              <br />
              <span className='font-medium text-primary'>AI costs in real time</span>
            </h1>
            
            <p className='text-lg sm:text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed'>
              See exactly how much each feature, model, and endpoint costs.
              <br />
              No mandatory SDK. No lock-in. 5-minute setup.
            </p>
            
            <div className='flex justify-center items-center pt-4 gap-4'>
              <Button 
                asChild 
                size='lg' 
                className='px-8 py-6 text-base font-normal h-auto rounded-full hover:scale-105 transition-transform duration-300'
              >
                <Link to='/sign-up'>
                  Start free now
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </div>
            
            <div className='flex flex-wrap justify-center gap-6 pt-4 text-sm text-muted-foreground'>
              <span className='flex items-center gap-2'>
                <Check className='h-4 w-4 text-primary' />
                No credit card required
              </span>
              <span className='flex items-center gap-2'>
                <Check className='h-4 w-4 text-primary' />
                Setup in minutes
              </span>
              <span className='flex items-center gap-2'>
                <Check className='h-4 w-4 text-primary' />
                Real-time data
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Preview do Dashboard - Foco no produto */}
      <section className='py-16 border-b bg-muted/20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-7xl mx-auto space-y-8'>
            <div className='text-center space-y-4'>
              <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4'>
                <Eye className='h-4 w-4' />
                <span>Dashboard preview</span>
              </div>
              <h2 className='text-3xl sm:text-4xl font-light tracking-tight'>
                See what you’ll get
              </h2>
              <p className='text-lg text-muted-foreground font-light max-w-2xl mx-auto'>
                Sample data for demonstration. Your real data will look like this.
              </p>
            </div>

            {/* Dashboard Preview */}
            <div className='bg-background border rounded-lg p-6 shadow-lg'>
              {/* Overview Cards */}
              <div className='mb-8'>
                <OverviewCards overview={mockDashboardData.overview} />
              </div>

              {/* Time Series Chart */}
              <div className='mb-8'>
                <TimeSeriesChart data={mockDashboardData.timeSeries} />
              </div>

              {/* Top Rankings */}
              <div className='grid gap-4 lg:grid-cols-2 mb-8'>
                <TopRankings
                  title='Top Features'
                  data={mockDashboardData.topFeatures}
                  type='features'
                />
                <TopRankings
                  title='Top Models'
                  data={mockDashboardData.topModels}
                  type='models'
                />
                <TopRankings
                  title='Top Providers'
                  data={mockDashboardData.topProviders}
                  type='providers'
                />
                <TopRankings
                  title='Top Tags'
                  data={mockDashboardData.topTags}
                  type='tags'
                />
              </div>

              {/* Budget Status */}
              <div>
                <BudgetStatusCards budgetsStatus={mockDashboardData.budgetsStatus} />
              </div>
            </div>

            {/* Insights destacados */}
            <div className='grid sm:grid-cols-3 gap-6 pt-8'>
              {[
                {
                  title: 'Find hidden costs',
                  description: 'See that the “chat-completion” feature is consuming 43.8% of your budget',
                },
                {
                  title: 'Track trends',
                  description: 'Monitor cost growth over time and forecast future spend',
                },
                {
                  title: 'Control with budgets',
                  description: 'Set alerts and limits to avoid billing surprises',
                },
              ].map((insight, i) => (
                <div key={i} className='p-6 rounded-lg border bg-background space-y-2'>
                  <h3 className='font-medium'>{insight.title}</h3>
                  <p className='text-sm text-muted-foreground font-light'>{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Valor Agregado */}
      <section className='py-16 border-b'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto space-y-12'>
            <div className='text-center space-y-4'>
              <h2 className='text-3xl sm:text-4xl font-light tracking-tight'>
                What you unlock with visibility
              </h2>
              <p className='text-lg text-muted-foreground font-light'>
                Benchmarks from companies using LLM Cost Radar
              </p>
            </div>
            
            <div className='grid sm:grid-cols-2 gap-8'>
              {[
                {
                  metric: '30-80%',
                  label: 'Cost reduction',
                  description: 'By identifying expensive features and models, teams significantly reduced spend',
                },
                {
                  metric: '48h',
                  label: 'Time to insight',
                  description: 'Detect cost issues in under 48 hours, not weeks',
                },
                {
                  metric: '100%',
                  label: 'Visibility',
                  description: 'See every dollar by feature, model, provider, and tag',
                },
                {
                  metric: 'Zero',
                  label: 'Refactoring required',
                  description: 'Works with any stack. Just send an HTTP request',
                },
              ].map((item, i) => (
                <div key={i} className='space-y-3 p-6 rounded-lg border hover:bg-muted/50 transition-colors'>
                  <div className='text-3xl font-light text-primary'>{item.metric}</div>
                  <h3 className='text-lg font-medium'>{item.label}</h3>
                  <p className='text-sm text-muted-foreground font-light leading-relaxed'>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona - Simplificado */}
      <section className='py-16 border-b bg-muted/20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto space-y-12'>
            <div className='text-center space-y-4'>
              <h2 className='text-3xl sm:text-4xl font-light tracking-tight'>
                How it works
              </h2>
              <p className='text-lg text-muted-foreground font-light'>
                Three simple steps to get started
              </p>
            </div>
            
            <div className='grid sm:grid-cols-3 gap-8'>
              {[
                {
                  step: '1',
                  title: 'Create your account',
                  description: 'Generate an API key in seconds. No credit card required.',
                },
                {
                  step: '2',
                  title: 'Send events',
                  description: 'A single HTTP endpoint. Works with cURL, any language, any provider.',
                },
                {
                  step: '3',
                  title: 'See your data',
                  description: 'Instant dashboard with costs, trends, rankings, and real-time budgets.',
                },
              ].map((item, i) => (
                <div key={i} className='text-center space-y-4'>
                  <div className='inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5'>
                    <span className='text-lg font-light text-primary'>{item.step}</span>
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-lg font-medium'>{item.title}</h3>
                    <p className='text-sm text-muted-foreground font-light leading-relaxed'>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className='py-24 border-b'>
        <div className='container mx-auto px-4'>
          <div className='max-w-2xl mx-auto text-center space-y-8'>
            <h2 className='text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight'>
              Stop guessing
              <br />
              <span className='font-medium'>your AI spend</span>
            </h2>
            
            <p className='text-xl text-muted-foreground font-light'>
              Get control before it scales. Start now — in under 5 minutes.
            </p>
            
            <Button 
              asChild 
              size='lg' 
              className='px-8 py-6 text-base font-normal h-auto rounded-full hover:scale-105 transition-transform duration-300'
            >
              <Link to='/sign-up'>
                Start free now
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            
            <div className='flex flex-wrap justify-center gap-6 pt-4 text-sm text-muted-foreground font-light'>
              <span>No credit card required</span>
              <span>•</span>
              <span>Setup in minutes</span>
              <span>•</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className='py-12 border-t'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-light'>
            <p>© 2024 LLM Cost Radar</p>
            <div className='flex gap-6'>
              <Link to='/documentation' className='hover:text-foreground transition-colors'>
                Documentation
              </Link>
              <Link to='/sign-in' className='hover:text-foreground transition-colors'>
                Sign in
              </Link>
              <Link to='/sign-up' className='hover:text-foreground transition-colors'>
                Start free
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
