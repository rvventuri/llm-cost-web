import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { login } from '@/lib/auth-api'
import { listApiKeys } from '@/lib/api-keys-api'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(6, 'Password must be at least 6 characters long'),
})

type UserAuthFormProps = React.HTMLAttributes<HTMLFormElement>

export function UserAuthForm({
  className,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const response = await login({
        email: data.email,
        password: data.password,
      })

      // Salvar token e usuário
      auth.setAccessToken(response.access_token)
      auth.setUser(response.user)

      // Verificar se existem API keys para decidir redirecionamento
      try {
        const apiKeys = await listApiKeys()
        const hasApiKeys = apiKeys && apiKeys.length > 0
        
        // Se existir API key, redirecionar para dashboard, senão para onboarding
        const targetPath = hasApiKeys ? '/dashboard-llm' : '/onboarding'
        navigate({ to: targetPath, replace: true })
      } catch {
        // Se houver erro ao buscar API keys, redirecionar para onboarding
        navigate({ to: '/onboarding', replace: true })
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao fazer login'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-light'>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel className='font-light'>Senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='absolute end-0 -top-0.5 text-sm font-light text-muted-foreground hover:text-foreground transition-colors'
              >
                Esqueceu a senha?
              </Link>
            </FormItem>
          )}
        />
        <Button 
          className='mt-2 w-full rounded-full font-light' 
          disabled={isLoading}
          size='lg'
        >
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Entrando...
            </>
          ) : (
            <>
              <LogIn className='mr-2 h-4 w-4' />
              Entrar
            </>
          )}
        </Button>

        <div className='text-center text-sm text-muted-foreground font-light'>
          Não tem uma conta?{' '}
          <Link
            to='/sign-up'
            className='font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors'
          >
            Cadastre-se
          </Link>
        </div>
      </form>
    </Form>
  )
}
