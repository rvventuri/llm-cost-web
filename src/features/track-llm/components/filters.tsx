import { useMemo } from 'react'
import { X, Filter, Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { TrackLLMEvent } from '@/lib/track-llm-api'

export interface TrackLLMFilters {
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  tags: string[]
  feature: string | undefined
  providers: string[]
  models: string[]
}

interface FiltersProps {
  events: TrackLLMEvent[]
  filters: TrackLLMFilters
  onFiltersChange: (filters: TrackLLMFilters) => void
}

export function Filters({ events, filters, onFiltersChange }: FiltersProps) {
  // Extrair valores únicos dos eventos para os filtros
  const uniqueValues = useMemo(() => {
    const providers = new Set<string>()
    const models = new Set<string>()
    const features = new Set<string>()
    const tags = new Set<string>()

    events.forEach((event) => {
      if (event.provider) providers.add(event.provider)
      if (event.model) models.add(event.model)
      if (event.feature) features.add(event.feature.name)
      if (event.tags && event.tags.length > 0) {
        event.tags.forEach((tag) => tags.add(tag.name))
      }
    })

    return {
      providers: Array.from(providers).sort(),
      models: Array.from(models).sort(),
      features: Array.from(features).sort(),
      tags: Array.from(tags).sort(),
    }
  }, [events])

  const hasActiveFilters =
    filters.dateRange.from ||
    filters.dateRange.to ||
    filters.tags.length > 0 ||
    filters.feature ||
    filters.providers.length > 0 ||
    filters.models.length > 0

  const updateFilters = (updates: Partial<TrackLLMFilters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const clearFilters = () => {
    onFiltersChange({
      dateRange: { from: undefined, to: undefined },
      tags: [],
      feature: undefined,
      providers: [],
      models: [],
    })
  }

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag]
    updateFilters({ tags: newTags })
  }

  const toggleProvider = (provider: string) => {
    const newProviders = filters.providers.includes(provider)
      ? filters.providers.filter((p) => p !== provider)
      : [...filters.providers, provider]
    updateFilters({ providers: newProviders })
  }

  const toggleModel = (model: string) => {
    const newModels = filters.models.includes(model)
      ? filters.models.filter((m) => m !== model)
      : [...filters.models, model]
    updateFilters({ models: newModels })
  }

  return (
    <div className='space-y-4 rounded-lg border bg-card p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Filter className='h-4 w-4 text-muted-foreground' />
          <h3 className='text-sm font-medium'>Filtros</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant='ghost'
            size='sm'
            onClick={clearFilters}
            className='h-8 text-xs'
          >
            Limpar todos
          </Button>
        )}
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {/* Date Range - From */}
        <div className='space-y-2'>
          <label className='text-xs font-medium text-muted-foreground'>
            Data Inicial
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !filters.dateRange.from && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {filters.dateRange.from ? (
                  format(filters.dateRange.from, 'dd/MM/yyyy')
                ) : (
                  <span>Selecione a data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={filters.dateRange.from}
                onSelect={(date) =>
                  updateFilters({ dateRange: { ...filters.dateRange, from: date } })
                }
                disabled={(date: Date) => {
                  if (date > new Date()) return true
                  if (filters.dateRange.to && date > filters.dateRange.to) return true
                  return false
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date Range - To */}
        <div className='space-y-2'>
          <label className='text-xs font-medium text-muted-foreground'>
            Data Final
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !filters.dateRange.to && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {filters.dateRange.to ? (
                  format(filters.dateRange.to, 'dd/MM/yyyy')
                ) : (
                  <span>Selecione a data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={filters.dateRange.to}
                onSelect={(date) =>
                  updateFilters({ dateRange: { ...filters.dateRange, to: date } })
                }
                disabled={(date: Date) => {
                  if (date > new Date()) return true
                  if (filters.dateRange.from && date < filters.dateRange.from) return true
                  return false
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Feature */}
        <div className='space-y-2'>
          <label className='text-xs font-medium text-muted-foreground'>
            Feature
          </label>
          <Select
            value={filters.feature || undefined}
            onValueChange={(value) =>
              updateFilters({ feature: value === 'all' ? undefined : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Todas as features' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Todas as features</SelectItem>
              {uniqueValues.features.map((feature) => (
                <SelectItem key={feature} value={feature}>
                  {feature}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Providers */}
      <div className='space-y-2'>
        <label className='text-xs font-medium text-muted-foreground'>
          Provedores
        </label>
        <div className='flex flex-wrap gap-2'>
          {uniqueValues.providers.map((provider) => {
            const isSelected = filters.providers.includes(provider)
            return (
              <Badge
                key={provider}
                variant={isSelected ? 'default' : 'outline'}
                className='cursor-pointer'
                onClick={() => toggleProvider(provider)}
              >
                {provider}
                {isSelected && <X className='ml-1 h-3 w-3' />}
              </Badge>
            )
          })}
        </div>
      </div>

      {/* Models */}
      <div className='space-y-2'>
        <label className='text-xs font-medium text-muted-foreground'>
          Modelos
        </label>
        <div className='flex flex-wrap gap-2'>
          {uniqueValues.models.map((model) => {
            const isSelected = filters.models.includes(model)
            return (
              <Badge
                key={model}
                variant={isSelected ? 'default' : 'outline'}
                className='cursor-pointer'
                onClick={() => toggleModel(model)}
              >
                {model}
                {isSelected && <X className='ml-1 h-3 w-3' />}
              </Badge>
            )
          })}
        </div>
      </div>

      {/* Tags */}
      <div className='space-y-2'>
        <label className='text-xs font-medium text-muted-foreground'>
          Tags
        </label>
        <div className='flex flex-wrap gap-2'>
          {uniqueValues.tags.map((tag) => {
            const isSelected = filters.tags.includes(tag)
            return (
              <Badge
                key={tag}
                variant={isSelected ? 'default' : 'outline'}
                className='cursor-pointer'
                onClick={() => toggleTag(tag)}
              >
                {tag}
                {isSelected && <X className='ml-1 h-3 w-3' />}
              </Badge>
            )
          })}
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className='flex flex-wrap items-center gap-2 pt-2 border-t'>
          <span className='text-xs text-muted-foreground'>Filtros ativos:</span>
          {filters.dateRange.from && (
            <Badge variant='secondary' className='text-xs'>
              De: {format(filters.dateRange.from, 'dd/MM/yyyy')}
              <X
                className='ml-1 h-3 w-3 cursor-pointer'
                onClick={() =>
                  updateFilters({
                    dateRange: { ...filters.dateRange, from: undefined },
                  })
                }
              />
            </Badge>
          )}
          {filters.dateRange.to && (
            <Badge variant='secondary' className='text-xs'>
              Até: {format(filters.dateRange.to, 'dd/MM/yyyy')}
              <X
                className='ml-1 h-3 w-3 cursor-pointer'
                onClick={() =>
                  updateFilters({
                    dateRange: { ...filters.dateRange, to: undefined },
                  })
                }
              />
            </Badge>
          )}
          {filters.feature && (
            <Badge variant='secondary' className='text-xs'>
              Feature: {filters.feature}
              <X
                className='ml-1 h-3 w-3 cursor-pointer'
                onClick={() => updateFilters({ feature: undefined })}
              />
            </Badge>
          )}
          {filters.providers.map((provider) => (
            <Badge key={provider} variant='secondary' className='text-xs'>
              {provider}
              <X
                className='ml-1 h-3 w-3 cursor-pointer'
                onClick={() => toggleProvider(provider)}
              />
            </Badge>
          ))}
          {filters.models.map((model) => (
            <Badge key={model} variant='secondary' className='text-xs'>
              {model}
              <X
                className='ml-1 h-3 w-3 cursor-pointer'
                onClick={() => toggleModel(model)}
              />
            </Badge>
          ))}
          {filters.tags.map((tag) => (
            <Badge key={tag} variant='secondary' className='text-xs'>
              {tag}
              <X
                className='ml-1 h-3 w-3 cursor-pointer'
                onClick={() => toggleTag(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
