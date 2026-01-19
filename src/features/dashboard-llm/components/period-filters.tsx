import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format, parseISO, startOfWeek, startOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

type PeriodFiltersProps = {
  startDate: string
  endDate: string
  groupBy: 'day' | 'week' | 'month'
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onGroupByChange: (groupBy: 'day' | 'week' | 'month') => void
}

export function PeriodFilters({
  startDate,
  endDate,
  groupBy,
  onStartDateChange,
  onEndDateChange,
  onGroupByChange,
}: PeriodFiltersProps) {
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  const getPeriodDates = (period: string) => {
    const now = new Date()
    let start: Date
    let end: Date = new Date()

    switch (period) {
      case 'today':
        start = new Date(now)
        start.setHours(0, 0, 0, 0)
        break
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 })
        start.setHours(0, 0, 0, 0)
        break
      case 'month':
        start = startOfMonth(now)
        start.setHours(0, 0, 0, 0)
        break
      case 'lastMonth': {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        start = startOfMonth(lastMonth)
        start.setHours(0, 0, 0, 0)
        end = new Date(now.getFullYear(), now.getMonth(), 0)
        end.setHours(23, 59, 59, 999)
        break
      }
      default:
        start = startOfMonth(now)
    }

    return {
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd'),
    }
  }

  const handlePeriodClick = (period: string) => {
    const dates = getPeriodDates(period)
    onStartDateChange(dates.start)
    onEndDateChange(dates.end)
  }

  return (
    <div className='flex flex-wrap items-center gap-3'>
      {/* Botões rápidos */}
      <div className='flex gap-2'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => handlePeriodClick('today')}
        >
          Hoje
        </Button>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => handlePeriodClick('week')}
        >
          Esta Semana
        </Button>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => handlePeriodClick('month')}
        >
          Este Mês
        </Button>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => handlePeriodClick('lastMonth')}
        >
          Mês Passado
        </Button>
      </div>

      {/* Seletores de data */}
      <div className='flex gap-2'>
        <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className={cn(
                'w-[200px] justify-start text-left font-normal',
                !startDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {startDate ? (
                format(parseISO(startDate), "dd/MM/yyyy", { locale: ptBR })
              ) : (
                <span>Data inicial</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              selected={startDate ? parseISO(startDate) : undefined}
              onSelect={(date) => {
                if (date) {
                  onStartDateChange(format(date, 'yyyy-MM-dd'))
                  setStartDateOpen(false)
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className={cn(
                'w-[200px] justify-start text-left font-normal',
                !endDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {endDate ? (
                format(parseISO(endDate), "dd/MM/yyyy", { locale: ptBR })
              ) : (
                <span>Data final</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              selected={endDate ? parseISO(endDate) : undefined}
              onSelect={(date) => {
                if (date) {
                  onEndDateChange(format(date, 'yyyy-MM-dd'))
                  setEndDateOpen(false)
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Agrupamento */}
      <Select value={groupBy} onValueChange={onGroupByChange}>
        <SelectTrigger className='w-[150px]'>
          <SelectValue placeholder='Agrupar por' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='day'>Por Dia</SelectItem>
          <SelectItem value='week'>Por Semana</SelectItem>
          <SelectItem value='month'>Por Mês</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
