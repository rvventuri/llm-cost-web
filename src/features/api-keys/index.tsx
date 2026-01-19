import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ApiKeysDialogs } from './components/api-keys-dialogs'
import { ApiKeysPrimaryButtons } from './components/api-keys-primary-buttons'
import { ApiKeysProvider } from './components/api-keys-provider'
import { ApiKeysTable } from './components/api-keys-table'
import { listApiKeys, type ApiKey } from '@/lib/api-keys-api'

const route = getRouteApi('/_authenticated/api-keys/')

export function ApiKeys() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadApiKeys = async () => {
    setIsLoading(true)
    try {
      const data = await listApiKeys()
      setApiKeys(data)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao carregar API keys'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadApiKeys()
  }, [])

  return (
    <ApiKeysProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>API Keys</h2>
            <p className='text-muted-foreground'>
              Gerencie suas chaves de acesso da API aqui.
            </p>
          </div>
          <ApiKeysPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <ApiKeysTable data={apiKeys} search={search} navigate={navigate} />
        )}
      </Main>

      <ApiKeysDialogs onRefresh={loadApiKeys} />
    </ApiKeysProvider>
  )
}
