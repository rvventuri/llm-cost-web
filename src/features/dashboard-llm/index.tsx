import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format, startOfMonth } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { getDashboard, type DashboardParams } from '@/lib/dashboard-api'
import { OverviewCards } from './components/overview-cards'
import { TimeSeriesChart } from './components/time-series-chart'
import { TopRankings } from './components/top-rankings'
import { BudgetStatusCards } from './components/budget-status-cards'
import { PeriodFilters } from './components/period-filters'

export function DashboardLLM() {
  // Inicializar com mês atual
  const getInitialDates = () => {
    const now = new Date()
    const start = startOfMonth(now)
    return {
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(now, 'yyyy-MM-dd'),
    }
  }

  const [filters, setFilters] = useState<DashboardParams>({
    ...getInitialDates(),
    groupBy: 'day',
    limit: 10,
  })

  const {
    data: dashboardResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard', filters],
    queryFn: async () => {
      try {
        const response = await getDashboard(filters)
        return response
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao carregar dashboard'
        toast.error(errorMessage)
        throw err
      }
    },
    refetchInterval: 5 * 1000, // Refetch a cada 5 segundos
  })

  const dashboard = dashboardResponse?.data

  const handleStartDateChange = (date: string) => {
    setFilters((prev) => ({ ...prev, startDate: date }))
  }

  const handleEndDateChange = (date: string) => {
    setFilters((prev) => ({ ...prev, endDate: date }))
  }

  const handleGroupByChange = (groupBy: 'day' | 'week' | 'month') => {
    setFilters((prev) => ({ ...prev, groupBy }))
  }

  if (isLoading) {
    return (
      <>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ProfileDropdown />
          </div>
        </Header>
        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        </Main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ProfileDropdown />
          </div>
        </Header>
        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
          <div className='flex flex-col items-center justify-center py-12'>
            <p className='text-lg font-medium text-destructive'>
              Erro ao carregar dashboard
            </p>
            <p className='text-sm text-muted-foreground mt-2'>
              {error instanceof Error ? error.message : 'Erro desconhecido'}
            </p>
          </div>
        </Main>
      </>
    )
  }

  if (!dashboard) {
    return (
      <>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ProfileDropdown />
          </div>
        </Header>
        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
          <div className='flex flex-col items-center justify-center py-12'>
            <p className='text-lg font-medium text-muted-foreground'>
              Nenhum dado disponível
            </p>
            <p className='text-sm text-muted-foreground mt-2'>
              Não há dados para o período selecionado
            </p>
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeToggleIcon />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex items-center justify-between space-y-2'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Dashboard LLM</h1>
            <p className='text-muted-foreground'>
              Visão completa de custos, uso e budgets
            </p>
          </div>
        </div>

        {/* Filtros de Período */}
        <PeriodFilters
          startDate={filters.startDate || ''}
          endDate={filters.endDate || ''}
          groupBy={filters.groupBy || 'day'}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onGroupByChange={handleGroupByChange}
        />

        {/* Overview Cards */}
        <OverviewCards overview={dashboard.overview} />

        {/* Time Series Chart */}
        {dashboard.timeSeries && dashboard.timeSeries.length > 0 && (
          <TimeSeriesChart data={dashboard.timeSeries} />
        )}

        {/* Top Rankings */}
        <div className='grid gap-4 lg:grid-cols-2'>
          {dashboard.topFeatures && dashboard.topFeatures.length > 0 && (
            <TopRankings
              title='Top Features'
              data={dashboard.topFeatures}
              type='features'
            />
          )}
          {dashboard.topTags && dashboard.topTags.length > 0 && (
            <TopRankings
              title='Top Tags'
              data={dashboard.topTags}
              type='tags'
            />
          )}
          {dashboard.topModels && dashboard.topModels.length > 0 && (
            <TopRankings
              title='Top Models'
              data={dashboard.topModels}
              type='models'
            />
          )}
          {dashboard.topProviders && dashboard.topProviders.length > 0 && (
            <TopRankings
              title='Top Providers'
              data={dashboard.topProviders}
              type='providers'
            />
          )}
        </div>

        {/* Budget Status Cards */}
        {dashboard.budgetsStatus && dashboard.budgetsStatus.length > 0 && (
          <BudgetStatusCards budgetsStatus={dashboard.budgetsStatus} />
        )}
      </Main>
    </>
  )
}
