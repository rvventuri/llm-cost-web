import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { listBudgets } from '@/lib/budgets-api'
import { BudgetsProvider } from './components/budgets-provider'
import { BudgetsPrimaryButtons } from './components/budgets-primary-buttons'
import { BudgetsTable } from './components/budgets-table'
import { BudgetsDialogs } from './components/budgets-dialogs'

export function Budgets() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false })
  const queryClient = useQueryClient()

  const {
    data: budgetsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      try {
        const response = await listBudgets()
        return response
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao carregar budgets'
        toast.error(errorMessage)
        throw err
      }
    },
  })

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['budgets'] })
  }

  if (isLoading) {
    return (
      <>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        </Main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header fixed>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
          <div className='flex flex-col items-center justify-center py-12'>
            <p className='text-lg font-medium text-destructive'>
              Erro ao carregar budgets
            </p>
            <p className='text-sm text-muted-foreground mt-2'>
              {error instanceof Error ? error.message : 'Erro desconhecido'}
            </p>
          </div>
        </Main>
      </>
    )
  }

  const budgets = budgetsResponse?.data || []

  return (
    <BudgetsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex items-center justify-between space-y-2'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Budgets</h1>
            <p className='text-muted-foreground'>
              Gerencie seus orçamentos e limites de gastos
            </p>
          </div>
          <BudgetsPrimaryButtons />
        </div>

        {budgets.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12'>
            <p className='text-lg font-medium text-muted-foreground'>
              Nenhum budget encontrado
            </p>
            <p className='text-sm text-muted-foreground mt-2'>
              Crie seu primeiro budget para começar a controlar seus gastos
            </p>
          </div>
        ) : (
          <BudgetsTable
            data={budgets}
            search={search as Record<string, unknown>}
            navigate={navigate}
          />
        )}

        <BudgetsDialogs onSuccess={handleSuccess} />
      </Main>
    </BudgetsProvider>
  )
}
