import { BookOpen } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {

  return (
    <div className='min-h-screen bg-background'>
      {/* Header - Minimalista */}
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto px-4'>
          <div className='flex h-16 items-center justify-between'>
            <Link to='/landing' className='flex items-center space-x-2'>
              <div className='text-lg font-medium tracking-tight'>LLM Cost Radar</div>
            </Link>
            
            <nav className='flex items-center gap-4'>
              <Link
                to='/documentation'
                className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-light'
              >
                <BookOpen className='h-4 w-4' />
                Documentação
              </Link>
              
              <div className='flex items-center gap-2'>
                <Button asChild variant='ghost' size='sm' className='font-light'>
                  <Link to='/sign-in'>Entrar</Link>
                </Button>
                <Button asChild size='sm' className='font-light rounded-full'>
                  <Link to='/sign-up'>Criar conta</Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Content - Minimalista */}
      <main className='container mx-auto px-4 py-20'>
        <div className='max-w-md mx-auto'>
          <div className='space-y-8 text-center'>
            <div className='space-y-2'>
              <h1 className='text-4xl font-light tracking-tight'>
                Entrar
              </h1>
              <p className='text-muted-foreground font-light'>
                Entre com sua conta para continuar
              </p>
            </div>
            
            <div className='border rounded-lg p-8 bg-background'>
              <UserAuthForm />
            </div>
            
            <p className='text-xs text-muted-foreground font-light'>
              Ao entrar, você concorda com nossos{' '}
              <Link to='/terms' className='underline hover:text-foreground transition-colors'>
                Termos de Serviço
              </Link>{' '}
              e{' '}
              <Link to='/privacy' className='underline hover:text-foreground transition-colors'>
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
