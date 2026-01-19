import { useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { deleteBudget, type Budget } from '@/lib/budgets-api'
import { useBudgets } from './budgets-provider'

type BudgetsDeleteDialogProps = {
  currentBudget: Budget | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function BudgetsDeleteDialog({
  currentBudget,
  open,
  onOpenChange,
  onSuccess,
}: BudgetsDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { closeDialog } = useBudgets()

  const handleDelete = async () => {
    if (!currentBudget) return

    setIsLoading(true)
    try {
      await deleteBudget(currentBudget.id)
      toast.success('Budget deletado com sucesso!')
      onOpenChange(false)
      closeDialog()
      onSuccess()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao deletar budget'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    closeDialog()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Deletar Budget</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja deletar o budget{' '}
            <strong>&quot;{currentBudget?.name}&quot;</strong>? Esta ação não pode
            ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            <Trash2 className='mr-2 h-4 w-4' />
            Deletar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
