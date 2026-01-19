import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import type { ApiKey } from '@/lib/api-keys-api'
import { DataTableRowActions } from './data-table-row-actions'

const getStatusBadge = (apiKey: ApiKey) => {
  const now = new Date()
  const expiresAt = apiKey.expiresAt ? new Date(apiKey.expiresAt) : null

  if (!apiKey.isActive) {
    return { label: 'Inativa', variant: 'secondary' as const }
  }

  if (expiresAt && expiresAt < now) {
    return { label: 'Expirada', variant: 'destructive' as const }
  }

  return { label: 'Ativa', variant: 'default' as const }
}

export const apiKeysColumns: ColumnDef<ApiKey>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nome' />
    ),
    cell: ({ row }) => {
      const name = row.getValue('name') as string | null
      return (
        <div className='max-w-48 font-medium'>
          {name || <span className='text-muted-foreground'>(Sem nome)</span>}
        </div>
      )
    },
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = getStatusBadge(row.original)
      return (
        <Badge variant={status.variant} className='capitalize'>
          {status.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      if (!value || !Array.isArray(value) || value.length === 0) return true
      const status = getStatusBadge(row.original)
      // Converter valores do filtro para comparar com os labels
      const statusMap: Record<string, string> = {
        ativa: 'ativa',
        inativa: 'inativa',
        expirada: 'expirada',
        active: 'ativa',
        inactive: 'inativa',
        expired: 'expirada',
      }
      return value.some(
        (v) =>
          statusMap[v.toLowerCase()] === status.label.toLowerCase() ||
          v.toLowerCase() === status.label.toLowerCase()
      )
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'expiresAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Expira em' />
    ),
    cell: ({ row }) => {
      const expiresAt = row.getValue('expiresAt') as string | null
      if (!expiresAt) {
        return <span className='text-muted-foreground'>Nunca</span>
      }
      return (
        <div>
          {format(new Date(expiresAt), "dd/MM/yyyy 'às' HH:mm", {
            locale: ptBR,
          })}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'lastUsedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Último uso' />
    ),
    cell: ({ row }) => {
      const lastUsedAt = row.getValue('lastUsedAt') as string | null
      if (!lastUsedAt) {
        return <span className='text-muted-foreground'>Nunca usado</span>
      }
      return (
        <div>
          {format(new Date(lastUsedAt), "dd/MM/yyyy 'às' HH:mm", {
            locale: ptBR,
          })}
        </div>
      )
    },
    enableSorting: false,
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
