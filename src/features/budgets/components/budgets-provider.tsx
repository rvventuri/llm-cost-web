import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Budget } from '@/lib/budgets-api'

type BudgetDialogType = 'create' | 'edit' | 'delete' | null

interface BudgetsContextType {
  dialogOpen: boolean
  dialogType: BudgetDialogType
  currentBudget: Budget | null
  setDialogOpen: (open: boolean) => void
  setDialogType: (type: BudgetDialogType) => void
  setCurrentBudget: (budget: Budget | null) => void
  openCreateDialog: () => void
  openEditDialog: (budget: Budget) => void
  openDeleteDialog: (budget: Budget) => void
  closeDialog: () => void
}

const BudgetsContext = createContext<BudgetsContextType | null>(null)

interface BudgetsProviderProps {
  children: ReactNode
}

export function BudgetsProvider({ children }: BudgetsProviderProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<BudgetDialogType>(null)
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null)

  const openCreateDialog = () => {
    setCurrentBudget(null)
    setDialogType('create')
    setDialogOpen(true)
  }

  const openEditDialog = (budget: Budget) => {
    setCurrentBudget(budget)
    setDialogType('edit')
    setDialogOpen(true)
  }

  const openDeleteDialog = (budget: Budget) => {
    setCurrentBudget(budget)
    setDialogType('delete')
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setDialogType(null)
    setCurrentBudget(null)
  }

  return (
    <BudgetsContext.Provider
      value={{
        dialogOpen,
        dialogType,
        currentBudget,
        setDialogOpen,
        setDialogType,
        setCurrentBudget,
        openCreateDialog,
        openEditDialog,
        openDeleteDialog,
        closeDialog,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  )
}

export const useBudgets = () => {
  const context = useContext(BudgetsContext)
  if (!context) {
    throw new Error('useBudgets must be used within BudgetsProvider')
  }
  return context
}
