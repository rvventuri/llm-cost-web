import { useEffect, useState, useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { listTrackLLMEvents } from '@/lib/track-llm-api'
import type { TrackLLMEvent } from '@/lib/track-llm-api'
import { EventsTable } from './components/events-table'
import { Filters, type TrackLLMFilters } from './components/filters'

export function TrackLLM() {
  const [events, setEvents] = useState<TrackLLMEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<TrackLLMFilters>({
    dateRange: { from: undefined, to: undefined },
    tags: [],
    feature: undefined,
    providers: [],
    models: [],
  })

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      const response = await listTrackLLMEvents()
      setEvents(response.data)
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao carregar eventos de LLM'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  // Filtrar eventos baseado nos filtros selecionados
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const eventDate = new Date(event.createdAt)
        eventDate.setHours(0, 0, 0, 0)

        if (filters.dateRange.from) {
          const fromDate = new Date(filters.dateRange.from)
          fromDate.setHours(0, 0, 0, 0)
          if (eventDate < fromDate) return false
        }

        if (filters.dateRange.to) {
          const toDate = new Date(filters.dateRange.to)
          toDate.setHours(23, 59, 59, 999)
          if (eventDate > toDate) return false
        }
      }

      // Feature filter
      if (filters.feature && event.feature?.name !== filters.feature) {
        return false
      }

      // Providers filter
      if (filters.providers.length > 0 && !filters.providers.includes(event.provider)) {
        return false
      }

      // Models filter
      if (filters.models.length > 0 && !filters.models.includes(event.model)) {
        return false
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const eventTags = event.tags || []
        const eventTagNames = eventTags.map((tag) => tag.name)
        const hasMatchingTag = filters.tags.some((tag) => eventTagNames.includes(tag))
        if (!hasMatchingTag) return false
      }

      return true
    })
  }, [events, filters])

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex items-center justify-between space-y-2'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Logs de eventos
            </h1>
            <p className='text-muted-foreground'>
              Acompanhe todos os eventos de LLM registrados
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ) : events.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12'>
            <p className='text-lg font-medium text-muted-foreground'>
              Nenhum evento encontrado
            </p>
            <p className='text-sm text-muted-foreground mt-2'>
              Comece a rastrear eventos de LLM para ver métricas aqui
            </p>
          </div>
        ) : (
          <>
            <Filters events={events} filters={filters} onFiltersChange={setFilters} />
            <div>
              <h2 className='text-xl font-bold tracking-tight mb-4'>
                Eventos Recentes {filteredEvents.length !== events.length && `(${filteredEvents.length} de ${events.length})`}
              </h2>
              <EventsTable events={filteredEvents} />
            </div>
          </>
        )}
      </Main>
    </>
  )
}
