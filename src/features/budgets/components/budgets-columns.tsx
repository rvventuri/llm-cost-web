import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import type { Budget } from '@/lib/budgets-api'
import { DataTableRowActions } from './data-table-row-actions'

const getTypeBadge = (type: 'tokens' | 'usd') => {
  if (type === 'usd') {
    return { label: 'USD', variant: 'default' as const }
  }
  return { label: 'Tokens', variant: 'secondary' as const }
}

const getPeriodBadge = (period: 'daily' | 'weekly' | 'monthly') => {
  const labels = {
    daily: 'Diário',
    weekly: 'Semanal',
    monthly: 'Mensal',
  }
  return { label: labels[period], variant: 'outline' as const }
}

const formatAmount = (amount: number, type: 'tokens' | 'usd') => {
  if (type === 'usd') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }
  return new Intl.NumberFormat('en-US').format(amount)
}

const getFilterLabel = (budget: Budget) => {
  if (budget.feature) return `Feature: ${budget.feature.name}`
  if (budget.tag) return `Tag: ${budget.tag.name}`
  if (budget.model) return `Model: ${budget.model.name}`
  if (budget.provider) return `Provider: ${budget.provider.name}`
  return 'Geral'
}

export const budgetsColumns: ColumnDef<Budget>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nome' />
    ),
    cell: ({ row }) => {
      return (
        <div className='max-w-64 font-medium'>
          {row.getValue('name')}
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Valor' />
    ),
    cell: ({ row }) => {
      const budget = row.original
      return (
        <div className='font-medium'>
          {formatAmount(budget.amount, budget.type)}
        </div>
      )
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tipo' />
    ),
    cell: ({ row }) => {
      const type = row.getValue('type') as 'tokens' | 'usd'
      const badge = getTypeBadge(type)
      return <Badge variant={badge.variant}>{badge.label}</Badge>
    },
  },
  {
    accessorKey: 'period',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Período' />
    ),
    cell: ({ row }) => {
      const period = row.getValue('period') as 'daily' | 'weekly' | 'monthly'
      const badge = getPeriodBadge(period)
      return <Badge variant={badge.variant}>{badge.label}</Badge>
    },
  },
  {
    id: 'filter',
    header: 'Filtro',
    cell: ({ row }) => {
      const budget = row.original
      const filterLabel = getFilterLabel(budget)
      return (
        <div className='text-sm text-muted-foreground'>
          {filterLabel}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Ativo' : 'Inativo'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      if (!value || !Array.isArray(value) || value.length === 0) return true
      const isActive = row.getValue(id) as boolean
      return value.some((v) => {
        if (typeof v === 'boolean') return v === isActive
        return (v === 'ativo' && isActive) || (v === 'inativo' && !isActive)
      })
    },
    enableHiding: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Criado em' />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string
      return (
        <div>
          {format(new Date(createdAt), "dd/MM/yyyy 'às' HH:mm", {
            locale: ptBR,
          })}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
