import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from '@tanstack/react-router'
import { Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { register } from '@/lib/auth-api'
import { listApiKeys } from '@/lib/api-keys-api'
import { useAuthStore } from '@/stores/auth-store'
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

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Por favor, informe seu nome')
      .min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.email({
      error: (iss) =>
        iss.input === '' ? 'Por favor, informe seu email' : undefined,
    }),
    password: z
      .string()
      .min(1, 'Por favor, informe sua senha')
      .min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Por favor, confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const response = await register({
        name: data.name,
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
        // Se houver erro ao buscar API keys (provavelmente porque é novo usuário), redirecionar para onboarding
        navigate({ to: '/onboarding', replace: true })
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao criar conta'
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
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-light'>Nome</FormLabel>
              <FormControl>
                <Input placeholder='João Silva' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
            <FormItem>
              <FormLabel className='font-light'>Senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-light'>Confirmar Senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
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
              Criando conta...
            </>
          ) : (
            <>
              <UserPlus className='mr-2 h-4 w-4' />
              Criar Conta
            </>
          )}
        </Button>

        <div className='text-center text-sm text-muted-foreground font-light'>
          Já tem uma conta?{' '}
          <Link
            to='/sign-in'
            className='font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors'
          >
            Entrar
          </Link>
        </div>
      </form>
    </Form>
  )
}
