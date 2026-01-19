import { useState } from 'react'
import { Loader2 } from 'lucide-react'
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
import { deleteApiKey, type ApiKey } from '@/lib/api-keys-api'

type ApiKeysDeleteDialogProps = {
  currentRow: ApiKey | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ApiKeysDeleteDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: ApiKeysDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!currentRow) return

    setIsLoading(true)
    try {
      await deleteApiKey(currentRow.id)
      toast.success('API key deletada com sucesso!')
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao deletar API key'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>Deletar API Key</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. A API key será permanentemente
            removida e não poderá mais ser usada para autenticação.
            {currentRow?.name && (
              <span className='block mt-2 font-semibold'>
                API Key: {currentRow.name}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
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
            Deletar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
