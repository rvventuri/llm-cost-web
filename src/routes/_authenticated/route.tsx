import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    const { auth } = useAuthStore.getState()
    
    // Verificar se há token e usuário
    if (!auth.accessToken || !auth.user) {
      // Se está tentando acessar a raiz (/), redireciona para landing
      if (location.pathname === '/') {
        throw redirect({
          to: '/landing',
          replace: true,
        })
      }
      
      // Para outras rotas autenticadas, redirecionar para login
      throw redirect({
        to: '/sign-in',
        replace: true,
      })
    }
  },
  component: AuthenticatedLayout,
})
