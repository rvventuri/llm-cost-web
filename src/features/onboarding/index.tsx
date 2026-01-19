import { useState, useEffect, useRef } from 'react'
import { Check, ChevronRight, Copy, CheckCircle2, Loader2, Sparkles, Zap, BarChart3, Key, CheckCircle } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { createApiKey } from '@/lib/api-keys-api'
import { checkIsFirstEvent } from '@/lib/track-llm-api'
import { cn } from '@/lib/utils'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://5wtjwfacdi.us-east-1.awsapprunner.com'

type Step = 1 | 2 | 3

export function Onboarding() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [apiKeyName, setApiKeyName] = useState('')
  const [isCreatingKey, setIsCreatingKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isFirstEventDetected, setIsFirstEventDetected] = useState(false)
  const [isCheckingEvent, setIsCheckingEvent] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleCreateApiKey = async () => {
    if (!apiKeyName.trim()) {
      toast.error('Por favor, informe um nome para a API Key')
      return
    }

    setIsCreatingKey(true)
    try {
      const response = await createApiKey({ name: apiKeyName })
      setApiKey(response.apiKey)
      setCurrentStep(3)
      toast.success('API Key criada com sucesso!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar API Key'
      toast.error(errorMessage)
    } finally {
      setIsCreatingKey(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copiado para a área de transferência!')
    setTimeout(() => setCopied(false), 2000)
  }

  const getCurlExample = () => {
    if (!apiKey) return ''
    return `curl -X POST ${API_BASE_URL}/track-llm \\
  -H "x-api-key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "ANTHROPIC",
    "model": "claude-3-5-sonnet-20241022",
    "tokensIn": 1000,
    "tokensOut": 500,
    "feature": "chat",
    "tags": ["production", "user-request"]
  }'`
  }

  // Função para verificar se é o primeiro evento
  const checkFirstEvent = async () => {
    try {
      setIsCheckingEvent(true)
      const response = await checkIsFirstEvent()
      // isFirstEvent = true significa que ainda não existe evento (é o primeiro)
      // Quando isFirstEvent = false, significa que já existe evento, então detectamos!
      if (response.data.isFirstEvent === false) {
        setIsFirstEventDetected(true)
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          pollingIntervalRef.current = null
        }
        toast.success('Primeiro evento detectado com sucesso!')
      }
    } catch {
      // Silenciar erros de polling
    } finally {
      setIsCheckingEvent(false)
    }
  }

  // Iniciar polling quando chegar no step 3
  useEffect(() => {
    if (currentStep === 3 && apiKey && !isFirstEventDetected) {
      // Verificar imediatamente
      checkFirstEvent()
      
      // Depois verificar a cada 5 segundos
      pollingIntervalRef.current = setInterval(() => {
        checkFirstEvent()
      }, 5 * 1000)

      // Cleanup ao desmontar ou quando mudar de step
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          pollingIntervalRef.current = null
        }
      }
    }
  }, [currentStep, apiKey, isFirstEventDetected])

  const handleGoToDashboard = () => {
    navigate({ to: '/dashboard-llm', replace: true })
  }

  const steps = [
    { number: 1, title: 'Introdução', completed: currentStep > 1 },
    { number: 2, title: 'Criar API Key', completed: currentStep > 2 },
    { number: 3, title: 'Exemplo de Uso', completed: false },
  ]

  return (
    <div className='min-h-screen bg-background'>
      <main className='container mx-auto px-4 py-12'>
        <div className='max-w-4xl mx-auto space-y-12'>
          {/* Header */}
          <div className='text-center space-y-4'>
            <Badge
              variant='outline'
              className='px-4 py-1.5 text-xs font-normal border-primary/20 bg-background/50'
            >
              Onboarding
            </Badge>
            <h1 className='text-4xl sm:text-5xl font-light tracking-tight leading-tight'>
              Bem-vindo ao <span className='font-medium text-primary'>LLM Cost Radar</span>
            </h1>
            <p className='text-lg text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed'>
              Vamos configurar sua conta em 3 passos simples
            </p>
          </div>

          {/* Stepper */}
          <div className='flex items-center justify-center gap-4'>
            {steps.map((step, index) => (
              <div key={step.number} className='flex items-center'>
                <div className='flex flex-col items-center'>
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                      step.completed
                        ? 'border-primary bg-primary text-primary-foreground'
                        : currentStep === step.number
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-muted text-muted-foreground'
                    )}
                  >
                    {step.completed ? (
                      <Check className='h-5 w-5' />
                    ) : (
                      <span className='text-sm font-medium'>{step.number}</span>
                    )}
                  </div>
                  <span className='mt-2 text-xs font-light text-muted-foreground'>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'mx-2 h-0.5 w-16 transition-colors',
                      step.completed ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl font-light'>
                {currentStep === 1 && 'Bem-vindo ao LLM Cost Radar'}
                {currentStep === 2 && 'Crie sua primeira API Key'}
                {currentStep === 3 && 'Exemplo de uso'}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Step 1: Introdução */}
              {currentStep === 1 && (
                <div className='space-y-6'>
                  <div className='space-y-4'>
                    <p className='text-muted-foreground font-light leading-relaxed'>
                      O LLM Cost Radar é uma ferramenta de FinOps para monitorar e controlar os
                      custos dos seus modelos de linguagem (LLMs) em produção.
                    </p>
                    <div className='grid sm:grid-cols-3 gap-6 pt-4'>
                      {[
                        {
                          icon: Zap,
                          title: 'Visibilidade Total',
                          description: 'Veja exatamente quanto cada modelo e feature está custando.',
                        },
                        {
                          icon: BarChart3,
                          title: 'Análise em Tempo Real',
                          description: 'Dashboard completo com métricas, tendências e alertas.',
                        },
                        {
                          icon: Sparkles,
                          title: 'Sem Refatoração',
                          description: 'Integre em minutos sem modificar seu código existente.',
                        },
                      ].map((item, i) => (
                        <div key={i} className='space-y-3 text-center'>
                          <div className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
                            <item.icon className='h-6 w-6' />
                          </div>
                          <h3 className='text-sm font-medium'>{item.title}</h3>
                          <p className='text-xs text-muted-foreground font-light leading-relaxed'>
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className='rounded-lg border-l-4 border-primary bg-primary/10 p-4 mt-6'>
                      <p className='text-sm text-muted-foreground font-light'>
                        <span className='font-medium text-foreground'>Pronto para começar?</span> No
                        próximo passo, vamos criar sua primeira API Key para começar a rastrear
                        seus custos.
                      </p>
                    </div>
                  </div>
                  <div className='flex justify-end'>
                    <Button
                      onClick={() => setCurrentStep(2)}
                      className='rounded-full font-light'
                    >
                      Próximo
                      <ChevronRight className='ml-2 h-4 w-4' />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Criar API Key */}
              {currentStep === 2 && (
                <div className='space-y-6'>
                  <div className='space-y-4'>
                    <p className='text-muted-foreground font-light leading-relaxed'>
                      A API Key é necessária para autenticar suas requisições. Você precisará dela
                      para enviar eventos de uso de LLMs ao nosso sistema.
                    </p>
                    <div className='space-y-2'>
                      <Label htmlFor='api-key-name' className='font-light'>
                        Nome da API Key
                      </Label>
                      <Input
                        id='api-key-name'
                        placeholder='Ex: Produção, Desenvolvimento, etc.'
                        value={apiKeyName}
                        onChange={(e) => setApiKeyName(e.target.value)}
                        className='font-light'
                      />
                      <p className='text-xs text-muted-foreground font-light'>
                        Escolha um nome descritivo para identificar esta chave
                      </p>
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <Button
                      variant='outline'
                      onClick={() => setCurrentStep(1)}
                      className='rounded-full font-light'
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={handleCreateApiKey}
                      disabled={!apiKeyName.trim() || isCreatingKey}
                      className='rounded-full font-light'
                    >
                      {isCreatingKey ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Criando...
                        </>
                      ) : (
                        <>
                          <Key className='mr-2 h-4 w-4' />
                          Criar API Key
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Exemplo de Uso */}
              {currentStep === 3 && apiKey && (
                <div className='space-y-6'>
                  {isFirstEventDetected ? (
                    // Tela de sucesso quando primeiro evento é detectado
                    <div className='space-y-6 text-center py-8'>
                      <div className='flex justify-center'>
                        <div className='rounded-full bg-green-500/10 p-6'>
                          <CheckCircle className='h-16 w-16 text-green-500' />
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <h3 className='text-2xl font-medium'>Configuração Efetuada com Sucesso!</h3>
                        <p className='text-muted-foreground font-light'>
                          Seu primeiro evento foi detectado. Agora você pode visualizar seus dados no dashboard.
                        </p>
                      </div>
                      <div className='pt-4'>
                        <Button
                          onClick={handleGoToDashboard}
                          size='lg'
                          className='rounded-full font-light'
                        >
                          Ir para Dashboard LLM
                          <ChevronRight className='ml-2 h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Tela de aguardando primeiro evento
                    <div className='space-y-4'>
                    <div className='rounded-lg border-l-4 border-green-500 bg-green-500/10 p-4'>
                      <div className='flex items-start gap-3'>
                        <CheckCircle2 className='h-5 w-5 text-green-500 flex-shrink-0 mt-0.5' />
                        <div className='space-y-1'>
                          <p className='font-medium text-sm'>API Key criada com sucesso!</p>
                          <p className='text-sm text-muted-foreground font-light'>
                            Copie a chave abaixo e guarde em um local seguro. Ela será exibida
                            apenas uma vez.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label className='font-light'>Sua API Key</Label>
                      <div className='flex gap-2'>
                        <Input
                          value={apiKey}
                          readOnly
                          className='font-mono text-sm'
                        />
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() => copyToClipboard(apiKey)}
                        >
                          {copied ? (
                            <CheckCircle2 className='h-4 w-4 text-green-500' />
                          ) : (
                            <Copy className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className='space-y-4 pt-4 border-t'>
                      <h3 className='text-lg font-medium'>Exemplo de uso com cURL</h3>
                      <p className='text-sm text-muted-foreground font-light'>
                        Copie o comando abaixo e execute no seu terminal para enviar seu primeiro
                        evento:
                      </p>
                      <div className='relative'>
                        <pre className='bg-muted/50 rounded-lg p-4 overflow-x-auto text-sm font-mono border'>
                          <code>{getCurlExample()}</code>
                        </pre>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='absolute top-2 right-2'
                          onClick={() => copyToClipboard(getCurlExample())}
                        >
                          {copied ? (
                            <CheckCircle2 className='h-4 w-4 text-green-500' />
                          ) : (
                            <Copy className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className='rounded-lg border-l-4 border-amber-500 bg-amber-500/10 p-4 mt-6'>
                      <div className='flex items-center gap-3'>
                        {isCheckingEvent && (
                          <Loader2 className='h-5 w-5 text-amber-500 animate-spin flex-shrink-0' />
                        )}
                        <p className='text-sm text-muted-foreground font-light'>
                          <span className='font-medium text-foreground'>
                            Aguardando primeiro evento...
                          </span>{' '}
                          Estamos verificando automaticamente a cada 5 segundos. Depois de enviar seu primeiro evento, você poderá visualizá-lo no dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                  )}
                  {!isFirstEventDetected && (
                    <div className='flex justify-between'>
                      <Button
                        variant='outline'
                        onClick={() => setCurrentStep(2)}
                        className='rounded-full font-light'
                      >
                        Voltar
                      </Button>
                      <Button
                        onClick={checkFirstEvent}
                        className='rounded-full font-light'
                        disabled={isCheckingEvent}
                      >
                        {isCheckingEvent ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Verificando...
                          </>
                        ) : (
                          'Verificar agora'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
