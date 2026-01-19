import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import type { TrackLLMEvent } from '@/lib/track-llm-api'

type EventsTableProps = {
  events: TrackLLMEvent[]
}

export function EventsTable({ events }: EventsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  const columns: ColumnDef<TrackLLMEvent>[] = useMemo(
    () => [
      {
        accessorKey: 'provider',
        header: 'Provedor',
        cell: ({ row }) => (
          <Badge variant='outline'>{row.getValue('provider')}</Badge>
        ),
      },
      {
        accessorKey: 'model',
        header: 'Modelo',
        cell: ({ row }) => (
          <div className='font-medium'>{row.getValue('model')}</div>
        ),
      },
      {
        accessorKey: 'tokensIn',
        header: 'Tokens Entrada',
        cell: ({ row }) => formatNumber(row.getValue('tokensIn')),
      },
      {
        accessorKey: 'tokensOut',
        header: 'Tokens Saída',
        cell: ({ row }) => formatNumber(row.getValue('tokensOut')),
      },
      {
        id: 'totalTokens',
        header: 'Total Tokens',
        cell: ({ row }) => {
          const tokensIn = row.original.tokensIn
          const tokensOut = row.original.tokensOut
          return formatNumber(tokensIn + tokensOut)
        },
      },
      {
        accessorKey: 'costInUsd',
        header: 'Custo (USD)',
        cell: ({ row }) => {
          const cost = row.getValue('costInUsd') as number
          return <div className='font-medium'>{formatCurrency(cost)}</div>
        },
      },
      {
        accessorKey: 'feature',
        header: 'Feature',
        cell: ({ row }) => {
          const feature = row.getValue('feature') as TrackLLMEvent['feature']
          return feature ? (
            <Badge variant='secondary'>{feature.name}</Badge>
          ) : (
            <span className='text-muted-foreground'>-</span>
          )
        },
      },
      {
        accessorKey: 'tags',
        header: 'Tags',
        cell: ({ row }) => {
          const tags = row.getValue('tags') as TrackLLMEvent['tags']
          if (!tags || tags.length === 0) {
            return <span className='text-muted-foreground'>-</span>
          }
          return (
            <div className='flex flex-wrap gap-1'>
              {tags.slice(0, 2).map((tag) => (
                <Badge key={tag.id} variant='outline' className='text-xs'>
                  {tag.name}
                </Badge>
              ))}
              {tags.length > 2 && (
                <Badge variant='outline' className='text-xs'>
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Data',
        cell: ({ row }) => {
          const date = new Date(row.getValue('createdAt'))
          return (
            <div className='text-sm'>
              {format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </div>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: events,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className='space-y-4'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Nenhum evento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
