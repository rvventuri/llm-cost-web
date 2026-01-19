import { BudgetsActionDialog } from './budgets-action-dialog'
import { BudgetsDeleteDialog } from './budgets-delete-dialog'
import { useBudgets } from './budgets-provider'

type BudgetsDialogsProps = {
  onSuccess: () => void
}

export function BudgetsDialogs({ onSuccess }: BudgetsDialogsProps) {
  const { dialogOpen, dialogType, currentBudget, closeDialog } = useBudgets()

  return (
    <>
      <BudgetsActionDialog
        currentBudget={currentBudget}
        open={dialogOpen && (dialogType === 'create' || dialogType === 'edit')}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
        onSuccess={onSuccess}
      />
      <BudgetsDeleteDialog
        currentBudget={currentBudget}
        open={dialogOpen && dialogType === 'delete'}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
        onSuccess={onSuccess}
      />
    </>
  )
}
