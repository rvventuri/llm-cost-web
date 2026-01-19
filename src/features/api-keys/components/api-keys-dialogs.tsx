import { useApiKeys } from './api-keys-provider'
import { ApiKeysActionDialog } from './api-keys-action-dialog'
import { ApiKeysDeleteDialog } from './api-keys-delete-dialog'

type ApiKeysDialogsProps = {
  onRefresh?: () => void
}

export function ApiKeysDialogs({ onRefresh }: ApiKeysDialogsProps) {
  const { open, setOpen, currentRow } = useApiKeys()

  const handleSuccess = () => {
    if (onRefresh) {
      onRefresh()
    }
  }

  return (
    <>
      <ApiKeysActionDialog
        currentRow={open === 'edit' ? currentRow : undefined}
        open={open === 'create' || open === 'edit'}
        onOpenChange={(state) => !state && setOpen(null)}
        onSuccess={handleSuccess}
      />
      <ApiKeysDeleteDialog
        currentRow={currentRow}
        open={open === 'delete'}
        onOpenChange={(state) => !state && setOpen(null)}
        onSuccess={handleSuccess}
      />
    </>
  )
}
