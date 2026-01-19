import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { ApiKey } from '@/lib/api-keys-api'

type ApiKeysDialogType = 'create' | 'edit' | 'delete'

type ApiKeysContextType = {
  open: ApiKeysDialogType | null
  setOpen: (str: ApiKeysDialogType | null) => void
  currentRow: ApiKey | null
  setCurrentRow: React.Dispatch<React.SetStateAction<ApiKey | null>>
}

const ApiKeysContext = React.createContext<ApiKeysContextType | null>(null)

export function ApiKeysProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<ApiKeysDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ApiKey | null>(null)

  return (
    <ApiKeysContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ApiKeysContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApiKeys = () => {
  const apiKeysContext = React.useContext(ApiKeysContext)

  if (!apiKeysContext) {
    throw new Error('useApiKeys has to be used within <ApiKeysProvider>')
  }

  return apiKeysContext
}
