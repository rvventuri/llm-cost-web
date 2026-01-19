import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBudgets } from './budgets-provider'

export function BudgetsPrimaryButtons() {
  const { openCreateDialog } = useBudgets()

  return (
    <Button onClick={openCreateDialog} size='sm' className='h-8 gap-1.5'>
      <Plus className='size-4' />
      Criar Budget
    </Button>
  )
}
