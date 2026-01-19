import { BookOpen, Code, ArrowRight, Key, Check, AlertCircle, Zap, Copy, CheckCircle2, Loader2, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

interface PriceData {
  provider: string
  model: string
  operator: string | null
  inputCostPer1m: number | null
  outputCostPer1m: number | null
  promptCacheWritePer1m: number | null
  promptCacheReadPer1m: number | null
  showInPlayground: boolean
  priceUpdatedAt: string | null
}

interface PricesResponse {
  success: boolean
  data: PriceData[]
  total: number
  note: string
}

function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <Button
      variant='ghost'
      size='sm'
      className='absolute top-2 right-2'
      onClick={handleCopy}
    >
      {copied ? (
        <CheckCircle2 className='h-4 w-4 text-green-500' />
      ) : (
        <Copy className='h-4 w-4' />
      )}
    </Button>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className='relative group'>
      <pre className='bg-muted/50 rounded-lg p-6 overflow-x-auto text-sm font-mono'>
        <code>{code}</code>
      </pre>
      <CopyCodeButton code={code} />
    </div>
  )
}

export function Docs() {
  const [prices, setPrices] = useState<PriceData[]>([])
  const [loadingPrices, setLoadingPrices] = useState(true)
  const [pricesError, setPricesError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPrices() {
      try {
        setLoadingPrices(true)
        setPricesError(null)
        const url = `${API_BASE_URL}/prices`
        console.log('Fetching prices from:', url)
        const response = await fetch(url)
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`Erro ao carregar preços: ${response.status} ${response.statusText}`)
        }
        
        const data: PricesResponse = await response.json()
        console.log('Prices data:', data)
        
        if (data.success && data.data && Array.isArray(data.data)) {
          setPrices(data.data)
          console.log(`Loaded ${data.data.length} models`)
          
          // Debug: verificar estrutura dos dados
          if (data.data.length > 0) {
            const sample = data.data[0]
            console.log('Sample model data:', sample)
            console.log('Sample provider:', sample.provider, 'type:', typeof sample.provider)
            console.log('Sample model:', sample.model, 'type:', typeof sample.model)
            
            // Contar modelos com provider válido
            const withValidProvider = data.data.filter(m => m.provider && m.provider !== 'null' && m.provider !== null)
            console.log(`Models with valid provider: ${withValidProvider.length} out of ${data.data.length}`)
            
            // Contar modelos com model válido
            const withValidModel = data.data.filter(m => m.model && m.model !== 'null' && m.model !== null)
            console.log(`Models with valid model: ${withValidModel.length} out of ${data.data.length}`)
            
            // Verificar alguns exemplos de provider/model inválidos
            const invalidProvider = data.data.filter(m => !m.provider || m.provider === 'null' || m.provider === null).slice(0, 3)
            if (invalidProvider.length > 0) {
              console.log('Examples of invalid providers:', invalidProvider.map(m => ({ provider: m.provider, model: m.model })))
            }
          }
        } else {
          console.warn('Invalid response format:', data)
          setPrices([])
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
        console.error('Error fetching prices:', error)
        setPricesError(`Não foi possível carregar os modelos: ${errorMessage}. Verifique se a API está acessível em ${API_BASE_URL}/prices`)
        setPrices([])
      } finally {
        setLoadingPrices(false)
      }
    }
    fetchPrices()
  }, [])

  // Agrupar modelos por provider (filtrar modelos inválidos)
  const validPrices = prices.filter((model) => {
    // Filtrar modelos inválidos: provider e model devem existir e não serem "null"
    if (!model) {
      console.log('Filtered out: model is falsy')
      return false
    }
    
    // Verificar provider
    const hasValidProvider = model.provider && 
                             model.provider !== 'null' && 
                             model.provider !== null &&
                             typeof model.provider === 'string' &&
                             model.provider.trim() !== ''
    
    if (!hasValidProvider) {
      console.log('Filtered out: invalid provider', model.provider)
      return false
    }
    
    // Verificar model
    const hasValidModel = model.model && 
                          model.model !== 'null' && 
                          model.model !== null &&
                          typeof model.model === 'string' &&
                          model.model.trim() !== ''
    
    if (!hasValidModel) {
      console.log('Filtered out: invalid model', model.model)
      return false
    }
    
    return true
  })

  console.log(`Valid prices after filter: ${validPrices.length} out of ${prices.length}`)

  const modelsByProvider = validPrices.reduce((acc, model) => {
    const provider = model.provider || 'Unknown'
    if (!acc[provider]) {
      acc[provider] = []
    }
    acc[provider].push(model)
    return acc
  }, {} as Record<string, PriceData[]>)
  
  console.log(`Models grouped by provider: ${Object.keys(modelsByProvider).length} providers`)

  const exampleCode = {
    curl: `curl -X POST https://api.llmcostradar.com/track-llm \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "ANTHROPIC",
    "model": "claude-3-5-sonnet-20241022",
    "tokensIn": 1000,
    "tokensOut": 500,
    "feature": "chat",
    "tags": ["production", "user-request"]
  }'`,
    
    javascript: `const response = await fetch('https://api.llmcostradar.com/track-llm', {
  method: 'POST',
  headers: {
    'x-api-key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    provider: 'ANTHROPIC',
    model: 'claude-3-5-sonnet-20241022',
    tokensIn: 1000,
    tokensOut: 500,
    feature: 'chat',
    tags: ['production', 'user-request']
  })
});

const data = await response.json();
console.log(data);`,
    
    python: `import requests

response = requests.post(
    'https://api.llmcostradar.com/track-llm',
    headers={
        'x-api-key': 'YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'provider': 'ANTHROPIC',
        'model': 'claude-3-5-sonnet-20241022',
        'tokensIn': 1000,
        'tokensOut': 500,
        'feature': 'chat',
        'tags': ['production', 'user-request']
    }
)

print(response.json())`,
    
    go: `package main

import (
    "bytes"
    "encoding/json"
    "net/http"
)

func main() {
    payload := map[string]interface{}{
        "provider": "ANTHROPIC",
        "model": "claude-3-5-sonnet-20241022",
        "tokensIn": 1000,
        "tokensOut": 500,
        "feature": "chat",
        "tags": []string{"production", "user-request"},
    }
    
    jsonData, _ := json.Marshal(payload)
    
    req, _ := http.NewRequest("POST", "https://api.llmcostradar.com/track-llm", bytes.NewBuffer(jsonData))
    req.Header.Set("x-api-key", "YOUR_API_KEY")
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()
}`
  }
  
  const sections = [
    { id: 'api-key', title: 'Como obter sua API Key' },
    { id: 'autenticacao', title: 'Autenticação' },
    { id: 'endpoint', title: 'Endpoint' },
    { id: 'exemplos-uso', title: 'Exemplos de Uso' },
    { id: 'modelos-aceitos', title: 'Modelos Aceitos' },
    { id: 'tratamento-erros', title: 'Tratamento de Erros' },
    { id: 'campos-opcionais', title: 'Campos Opcionais' },
  ]

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
                className='flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-light'
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

      {/* Content */}
      <main className='container mx-auto px-4 py-20'>
        <div className='flex gap-12 max-w-7xl mx-auto'>
          {/* Sidebar Navigation */}
          <aside className='hidden lg:block w-64 flex-shrink-0'>
            <div className='sticky top-24 space-y-2'>
              <h3 className='text-sm font-medium text-muted-foreground mb-4'>Navegação</h3>
              <nav className='space-y-1'>
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className='block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors font-light'
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className='flex-1 max-w-5xl space-y-20'>
          {/* Hero - Minimalista */}
          <div className='text-center space-y-8'>
            <Badge variant='outline' className='px-4 py-1.5 text-xs font-normal border-primary/20 bg-background/50'>
              API Documentation
            </Badge>
            <h1 className='text-5xl sm:text-6xl font-light tracking-tight leading-tight'>
              Documentação da <span className='font-medium text-primary'>API</span>
            </h1>
            <p className='text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed'>
              Rastreie eventos de uso de LLMs e calcule custos automaticamente. Integração simples, poderosa e focada em FinOps.
            </p>
          </div>

          {/* Como obter API Key - Minimalista */}
          <section id='api-key' className='space-y-8 border-b pb-16 scroll-mt-24'>
            <div className='flex items-center gap-3'>
              <Key className='h-6 w-6 text-primary' />
              <h2 className='text-3xl font-light tracking-tight'>Como obter sua API Key</h2>
            </div>
            
            <div className='space-y-6'>
              <div className='grid sm:grid-cols-3 gap-6'>
                {[
                  {
                    step: '1',
                    title: 'Crie sua conta',
                    description: 'Faça cadastro gratuito no LLM Cost Radar. Sem cartão de crédito necessário.',
                  },
                  {
                    step: '2',
                    title: 'Acesse API Keys',
                    description: 'No dashboard, vá até a seção "API Keys" no menu lateral.',
                  },
                  {
                    step: '3',
                    title: 'Gere uma nova key',
                    description: 'Clique em "Criar API Key", dê um nome descritivo e salve a chave exibida.',
                  },
                ].map((item, i) => (
                  <div key={i} className='group space-y-4 text-center'>
                    <div className='inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/20 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-300'>
                      <span className='text-lg font-light text-primary'>{item.step}</span>
                    </div>
                    <div className='space-y-2'>
                      <h3 className='text-lg font-medium group-hover:text-primary transition-colors'>
                        {item.title}
                      </h3>
                      <p className='text-sm text-muted-foreground font-light leading-relaxed'>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className='rounded-lg border-l-4 border-amber-500 bg-amber-500/10 p-6'>
                <div className='flex gap-3'>
                  <AlertCircle className='h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5' />
                  <div className='space-y-1'>
                    <p className='font-medium text-sm'>Importante</p>
                    <p className='text-sm text-muted-foreground font-light'>
                      A API key completa é exibida apenas uma vez no momento da criação. Certifique-se de salvá-la em um local seguro. Você pode gerar múltiplas keys e desativá-las quando necessário.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Autenticação - Minimalista */}
          <section id='autenticacao' className='space-y-8 border-b pb-16 scroll-mt-24'>
            <div className='flex items-center gap-3'>
              <Zap className='h-6 w-6 text-primary' />
              <h2 className='text-3xl font-light tracking-tight'>Autenticação</h2>
            </div>
            
            <div className='space-y-6'>
              <p className='text-muted-foreground font-light leading-relaxed'>
                A API utiliza autenticação via <strong className='text-foreground'>API Key</strong> (não JWT). 
                Envie sua API key no header da requisição usando uma das opções abaixo:
              </p>
              
              <div className='grid sm:grid-cols-2 gap-4'>
                <div className='space-y-2 p-4 rounded-lg bg-muted/50 border'>
                  <code className='text-sm font-mono font-medium'>x-api-key</code>
                  <p className='text-xs text-muted-foreground font-light'>Recomendado</p>
                </div>
                <div className='space-y-2 p-4 rounded-lg bg-muted/50 border'>
                  <code className='text-sm font-mono font-medium'>x-api-token</code>
                  <p className='text-xs text-muted-foreground font-light'>Alternativo</p>
                </div>
              </div>
              
              <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Exemplo de requisição autenticada</h3>
                <CodeBlock code={`curl -X POST https://api.llmcostradar.com/track-llm \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json"`} />
              </div>
              
              <div className='rounded-lg border-l-4 border-primary bg-primary/10 p-6'>
                <div className='flex gap-3'>
                  <Check className='h-5 w-5 text-primary flex-shrink-0 mt-0.5' />
                  <div className='space-y-2'>
                    <p className='font-medium text-sm'>Requisitos da API Key</p>
                    <ul className='text-sm text-muted-foreground font-light space-y-1 list-disc list-inside'>
                      <li>Deve estar ativa (<code className='px-1 py-0.5 bg-muted rounded text-xs'>isActive: true</code>)</li>
                      <li>Não deve estar expirada (se <code className='px-1 py-0.5 bg-muted rounded text-xs'>expiresAt</code> estiver definido)</li>
                      <li>Pertence à sua organização</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Endpoint - Minimalista */}
          <section id='endpoint' className='space-y-8 border-b pb-16 scroll-mt-24'>
            <div className='flex items-center gap-3'>
              <Code className='h-6 w-6 text-primary' />
              <h2 className='text-3xl font-light tracking-tight'>Endpoint</h2>
            </div>
            
            <div className='space-y-6'>
              <div className='flex items-center gap-4'>
                <Badge className='px-3 py-1 font-mono text-xs bg-green-500/20 text-green-600 border-green-500/30'>POST</Badge>
                <code className='text-xl font-mono font-light'>/track-llm</code>
              </div>
              
              <p className='text-lg text-muted-foreground font-light leading-relaxed'>
                Registra um evento de uso de modelo LLM e calcula automaticamente o custo em USD baseado nos preços mais recentes do modelo.
              </p>
              
              {/* Campos do Body */}
              <div className='space-y-6'>
                <h3 className='text-xl font-medium'>Campos do Body (JSON)</h3>
                
                <div className='overflow-x-auto border rounded-lg'>
                  <table className='w-full border-collapse'>
                    <thead className='bg-muted/50'>
                      <tr className='border-b'>
                        <th className='text-left p-4 text-sm font-medium'>Campo</th>
                        <th className='text-left p-4 text-sm font-medium'>Tipo</th>
                        <th className='text-left p-4 text-sm font-medium'>Obrigatório</th>
                        <th className='text-left p-4 text-sm font-medium'>Descrição</th>
                      </tr>
                    </thead>
                    <tbody className='text-sm'>
                      {[
                        {
                          field: 'provider',
                          type: 'string',
                          required: true,
                          description: 'Nome do provedor (ex: "ANTHROPIC", "OPENAI")',
                        },
                        {
                          field: 'model',
                          type: 'string',
                          required: true,
                          description: 'Nome do modelo (ex: "claude-3-5-sonnet-20241022")',
                        },
                        {
                          field: 'tokensIn',
                          type: 'number',
                          required: true,
                          description: 'Quantidade de tokens de entrada (input), deve ser >= 0',
                        },
                        {
                          field: 'tokensOut',
                          type: 'number',
                          required: true,
                          description: 'Quantidade de tokens de saída (output), deve ser >= 0',
                        },
                        {
                          field: 'feature',
                          type: 'string',
                          required: false,
                          description: 'Descrição da funcionalidade (ex: "chat", "completion")',
                        },
                        {
                          field: 'tags',
                          type: 'string[]',
                          required: false,
                          description: 'Array de strings para categorização (ex: ["production", "user-request"])',
                        },
                      ].map((item, i) => (
                        <tr key={i} className='border-b hover:bg-muted/30 transition-colors'>
                          <td className='p-4'><code className='px-2 py-1 bg-muted rounded text-xs font-mono'>{item.field}</code></td>
                          <td className='p-4 text-muted-foreground font-light'>{item.type}</td>
                          <td className='p-4'>
                            {item.required ? (
                              <Badge variant='destructive' className='text-xs'>Sim</Badge>
                            ) : (
                              <Badge variant='secondary' className='text-xs'>Não</Badge>
                            )}
                          </td>
                          <td className='p-4 text-muted-foreground font-light'>{item.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Exemplos de código */}
              <div className='space-y-4'>
                <h3 className='text-xl font-medium'>Exemplos de uso</h3>
                <Tabs defaultValue='curl' className='w-full'>
                  <TabsList className='grid w-full grid-cols-4'>
                    <TabsTrigger value='curl' className='text-xs'>cURL</TabsTrigger>
                    <TabsTrigger value='javascript' className='text-xs'>JavaScript</TabsTrigger>
                    <TabsTrigger value='python' className='text-xs'>Python</TabsTrigger>
                    <TabsTrigger value='go' className='text-xs'>Go</TabsTrigger>
                  </TabsList>
                  <TabsContent value='curl' className='mt-4'>
                    <CodeBlock code={exampleCode.curl} />
                  </TabsContent>
                  <TabsContent value='javascript' className='mt-4'>
                    <CodeBlock code={exampleCode.javascript} />
                  </TabsContent>
                  <TabsContent value='python' className='mt-4'>
                    <CodeBlock code={exampleCode.python} />
                  </TabsContent>
                  <TabsContent value='go' className='mt-4'>
                    <CodeBlock code={exampleCode.go} />
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Response */}
              <div className='space-y-4'>
                <h3 className='text-xl font-medium'>Response de sucesso (200 OK)</h3>
                <CodeBlock code={`{
  "success": true,
  "data": {
    "id": 1,
    "provider": "ANTHROPIC",
    "model": "claude-3-5-sonnet-20241022",
    "tokensIn": 1000,
    "tokensOut": 500,
    "costInUsd": 0.000003,
    "inputCostPer1m": 3,
    "outputCostPer1m": 15,
    "feature": "chat",
    "tags": ["production", "user-request"],
    "createdAt": "2026-01-16T15:30:00.000Z"
  }
}`} />
              </div>
            </div>
          </section>

          {/* Exemplos de Uso - Minimalista */}
          <section id='exemplos-uso' className='space-y-8 border-b pb-16 scroll-mt-24'>
            <div className='flex items-center gap-3'>
              <Code className='h-6 w-6 text-primary' />
              <h2 className='text-3xl font-light tracking-tight'>Exemplos de Uso</h2>
            </div>
            
            <div className='space-y-12'>
              <p className='text-muted-foreground font-light leading-relaxed'>
                Veja exemplos práticos de como integrar o LLM Cost Radar em suas aplicações. 
                Os exemplos mostram como interceptar chamadas de LLMs, extrair informações de tokens e enviar para nosso endpoint.
              </p>

              {/* Python com OpenAI */}
              <div className='space-y-4'>
                <h3 className='text-2xl font-light tracking-tight'>Python com OpenAI</h3>
                <p className='text-sm text-muted-foreground font-light leading-relaxed'>
                  Exemplo usando a biblioteca oficial do OpenAI para interceptar chamadas e enviar métricas:
                </p>
                <CodeBlock code={`import openai
import requests
import os

# Configuração
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
LLM_COST_RADAR_API_KEY = os.getenv('LLM_COST_RADAR_API_KEY')
LLM_COST_RADAR_URL = '${API_BASE_URL}/track-llm'

# Cliente OpenAI
client = openai.OpenAI(api_key=OPENAI_API_KEY)

def track_llm_usage(provider, model, tokens_in, tokens_out, feature=None, tags=None):
    """Envia dados de uso para o LLM Cost Radar"""
    try:
        response = requests.post(
            LLM_COST_RADAR_URL,
            headers={
                'x-api-key': LLM_COST_RADAR_API_KEY,
                'Content-Type': 'application/json'
            },
            json={
                'provider': provider,
                'model': model,
                'tokensIn': tokens_in,
                'tokensOut': tokens_out,
                'feature': feature,
                'tags': tags or []
            }
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f'Erro ao enviar métricas: {e}')
        return None

# Exemplo: Chat Completion
def chat_with_tracking(messages, feature='chat', tags=None):
    response = client.chat.completions.create(
        model='gpt-4',
        messages=messages
    )
    
    # Extrair informações de tokens
    usage = response.usage
    model = response.model
    
    # Enviar para LLM Cost Radar
    track_llm_usage(
        provider='OPENAI',
        model=model,
        tokens_in=usage.prompt_tokens,
        tokens_out=usage.completion_tokens,
        feature=feature,
        tags=tags or ['production']
    )
    
    return response

# Uso
messages = [{'role': 'user', 'content': 'Olá, como você está?'}]
response = chat_with_tracking(
    messages, 
    feature='chat',
    tags=['production', 'user-request']
)
print(response.choices[0].message.content)`} />
              </div>

              {/* Node.js com OpenAI */}
              <div className='space-y-4'>
                <h3 className='text-2xl font-light tracking-tight'>Node.js com OpenAI</h3>
                <p className='text-sm text-muted-foreground font-light leading-relaxed'>
                  Exemplo usando a biblioteca oficial do OpenAI para Node.js:
                </p>
                <CodeBlock code={`const OpenAI = require('openai');
const axios = require('axios');

// Configuração
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const LLM_COST_RADAR_API_KEY = process.env.LLM_COST_RADAR_API_KEY;
const LLM_COST_RADAR_URL = '${API_BASE_URL}/track-llm';

async function trackLLMUsage(provider, model, tokensIn, tokensOut, feature = null, tags = []) {
  try {
    const response = await axios.post(
      LLM_COST_RADAR_URL,
      {
        provider,
        model,
        tokensIn,
        tokensOut,
        feature,
        tags,
      },
      {
        headers: {
          'x-api-key': LLM_COST_RADAR_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar métricas:', error.message);
    return null;
  }
}

// Exemplo: Chat Completion
async function chatWithTracking(messages, feature = 'chat', tags = []) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messages,
  });

  const usage = completion.usage;
  const model = completion.model;

  // Enviar para LLM Cost Radar (não bloquear a resposta)
  trackLLMUsage(
    'OPENAI',
    model,
    usage.prompt_tokens,
    usage.completion_tokens,
    feature,
    tags
  ).catch((err) => console.error('Erro ao rastrear:', err));

  return completion;
}

// Uso
async function main() {
  const messages = [{ role: 'user', content: 'Olá, como você está?' }];
  const response = await chatWithTracking(
    messages,
    'chat',
    ['production', 'user-request']
  );
  console.log(response.choices[0].message.content);
}

main();`} />
              </div>

              {/* Python com Anthropic */}
              <div className='space-y-4'>
                <h3 className='text-2xl font-light tracking-tight'>Python com Anthropic (Claude)</h3>
                <p className='text-sm text-muted-foreground font-light leading-relaxed'>
                  Exemplo usando a biblioteca oficial do Anthropic:
                </p>
                <CodeBlock code={`import anthropic
import requests
import os

# Configuração
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')
LLM_COST_RADAR_API_KEY = os.getenv('LLM_COST_RADAR_API_KEY')
LLM_COST_RADAR_URL = '${API_BASE_URL}/track-llm'

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

def track_llm_usage(provider, model, tokens_in, tokens_out, feature=None, tags=None):
    """Envia dados de uso para o LLM Cost Radar"""
    try:
        response = requests.post(
            LLM_COST_RADAR_URL,
            headers={
                'x-api-key': LLM_COST_RADAR_API_KEY,
                'Content-Type': 'application/json'
            },
            json={
                'provider': provider,
                'model': model,
                'tokensIn': tokens_in,
                'tokensOut': tokens_out,
                'feature': feature,
                'tags': tags or []
            }
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f'Erro ao enviar métricas: {e}')
        return None

# Exemplo: Messages API
def claude_chat_with_tracking(messages, feature='chat', tags=None):
    message = client.messages.create(
        model='claude-3-5-sonnet-20241022',
        max_tokens=1024,
        messages=messages
    )
    
    # Extrair informações de tokens
    usage = message.usage
    model = message.model
    
    # Enviar para LLM Cost Radar
    track_llm_usage(
        provider='ANTHROPIC',
        model=model,
        tokens_in=usage.input_tokens,
        tokens_out=usage.output_tokens,
        feature=feature,
        tags=tags or ['production']
    )
    
    return message

# Uso
messages = [{'role': 'user', 'content': 'Explique o que é IA.'}]
response = claude_chat_with_tracking(
    messages,
    feature='chat',
    tags=['production', 'user-request']
)
print(response.content[0].text)`} />
              </div>

              {/* n8n Workflow */}
              <div className='space-y-4'>
                <h3 className='text-2xl font-light tracking-tight'>n8n (Workflow Automation)</h3>
                <p className='text-sm text-muted-foreground font-light leading-relaxed'>
                  Exemplo de workflow no n8n para rastrear uso de LLMs:
                </p>
                <CodeBlock code={`# Workflow n8n - Passo a passo

# 1. OpenAI Node (conecte sua conta OpenAI)
# Configure o nó para fazer a chamada de LLM
# Extraia a resposta com tokensIn e tokensOut

# 2. Code Node - Extrair tokens e preparar dados
# JavaScript code:
const openaiResponse = $input.item.json;

return {
  json: {
    provider: 'OPENAI',
    model: openaiResponse.model || 'gpt-4',
    tokensIn: openaiResponse.usage?.prompt_tokens || 0,
    tokensOut: openaiResponse.usage?.completion_tokens || 0,
    feature: 'chat',
    tags: ['n8n', 'workflow', 'production']
  }
};

# 3. HTTP Request Node - Enviar para LLM Cost Radar
# Method: POST
# URL: ${API_BASE_URL}/track-llm
# Headers:
#   - x-api-key: {{ $env.LLM_COST_RADAR_API_KEY }}
#   - Content-Type: application/json
# Body (JSON):
{
  "provider": "{{ $json.provider }}",
  "model": "{{ $json.model }}",
  "tokensIn": {{ $json.tokensIn }},
  "tokensOut": {{ $json.tokensOut }},
  "feature": "{{ $json.feature }}",
  "tags": {{ JSON.stringify($json.tags) }}
}

# Como configurar:
# 1. Crie um workflow no n8n
# 2. Adicione o nó OpenAI para fazer a chamada
# 3. Use o Code Node para extrair tokens
# 4. Configure o HTTP Request para enviar para nosso endpoint
# 5. Configure a variável de ambiente LLM_COST_RADAR_API_KEY`} />
              </div>

              {/* Python com Decorator Pattern */}
              <div className='space-y-4'>
                <h3 className='text-2xl font-light tracking-tight'>Python - Decorator Pattern</h3>
                <p className='text-sm text-muted-foreground font-light leading-relaxed'>
                  Decorator para rastrear automaticamente todas as chamadas de LLM:
                </p>
                <CodeBlock code={`import functools
import requests
import os
from typing import Optional, List

LLM_COST_RADAR_API_KEY = os.getenv('LLM_COST_RADAR_API_KEY')
LLM_COST_RADAR_URL = '${API_BASE_URL}/track-llm'

def track_llm_call(provider: str, feature: Optional[str] = None, tags: Optional[List[str]] = None):
    """Decorator para rastrear chamadas de LLM automaticamente"""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            response = func(*args, **kwargs)
            
            # Assumindo que a resposta tem 'usage' e 'model'
            if hasattr(response, 'usage') and hasattr(response, 'model'):
                usage = response.usage
                
                try:
                    requests.post(
                        LLM_COST_RADAR_URL,
                        headers={
                            'x-api-key': LLM_COST_RADAR_API_KEY,
                            'Content-Type': 'application/json'
                        },
                        json={
                            'provider': provider,
                            'model': response.model,
                            'tokensIn': getattr(usage, 'prompt_tokens', getattr(usage, 'input_tokens', 0)),
                            'tokensOut': getattr(usage, 'completion_tokens', getattr(usage, 'output_tokens', 0)),
                            'feature': feature or func.__name__,
                            'tags': tags or ['decorator', 'production']
                        },
                        timeout=2  # Não bloquear muito tempo
                    )
                except:
                    pass  # Ignorar erros silenciosamente
            
            return response
        return wrapper
    return decorator

# Uso com decorator
import openai
client = openai.OpenAI()

@track_llm_call(provider='OPENAI', feature='chat', tags=['production', 'decorator'])
def chat_completion(messages):
    return client.chat.completions.create(
        model='gpt-4',
        messages=messages
    )

# Chamada normal, rastreamento automático
response = chat_completion([{'role': 'user', 'content': 'Hello!'}])`} />
              </div>

              {/* Nota importante */}
              <div className='rounded-lg border-l-4 border-primary bg-primary/10 p-6 mt-8'>
                <div className='flex gap-3'>
                  <Check className='h-5 w-5 text-primary flex-shrink-0 mt-0.5' />
                  <div className='space-y-2'>
                    <p className='font-medium text-sm'>Dicas de Integração</p>
                    <ul className='text-sm text-muted-foreground font-light space-y-1 list-disc list-inside'>
                      <li>Envie métricas de forma assíncrona para não bloquear suas respostas ao usuário</li>
                      <li>Use <code className='px-1 py-0.5 bg-muted rounded text-xs'>feature</code> para categorizar por funcionalidade (chat, embedding, etc.)</li>
                      <li>Use <code className='px-1 py-0.5 bg-muted rounded text-xs'>tags</code> para filtrar por ambiente (production, staging, test)</li>
                      <li>Mantenha a API Key segura usando variáveis de ambiente</li>
                      <li>Trate erros de forma silenciosa para não impactar a experiência do usuário</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Modelos Aceitos - Minimalista */}
          <section id='modelos-aceitos' className='space-y-8 border-b pb-16 scroll-mt-24'>
            <div className='flex items-center gap-3'>
              <Database className='h-6 w-6 text-primary' />
              <h2 className='text-3xl font-light tracking-tight'>Modelos Aceitos</h2>
            </div>
            
            <div className='space-y-6'>
              <p className='text-muted-foreground font-light leading-relaxed'>
                Nossa API suporta uma ampla gama de modelos LLM de diferentes provedores. Os custos são calculados automaticamente baseados nos preços mais recentes de cada modelo.
              </p>

              {loadingPrices ? (
                <div className='flex items-center justify-center py-12'>
                  <Loader2 className='h-6 w-6 animate-spin text-primary' />
                  <span className='ml-3 text-sm text-muted-foreground font-light'>Carregando modelos...</span>
                </div>
              ) : pricesError ? (
                <div className='rounded-lg border-l-4 border-amber-500 bg-amber-500/10 p-6'>
                  <div className='flex gap-3'>
                    <AlertCircle className='h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5' />
                    <p className='text-sm text-muted-foreground font-light'>{pricesError}</p>
                  </div>
                </div>
              ) : prices.length > 0 ? (
                <div className='space-y-8'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm text-muted-foreground font-light'>
                      Total de <strong className='text-foreground'>{validPrices.length}</strong> modelos disponíveis
                    </p>
                  </div>
                  
                  {Object.keys(modelsByProvider).length > 0 ? (
                    <>
                      {Object.entries(modelsByProvider)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([provider, models]) => (
                          <div key={provider} className='space-y-4'>
                            <h3 className='text-xl font-medium'>{provider}</h3>
                            <div className='overflow-x-auto border rounded-lg'>
                              <table className='w-full border-collapse'>
                                <thead className='bg-muted/50'>
                                  <tr className='border-b'>
                                    <th className='text-left p-4 text-sm font-medium'>Modelo</th>
                                    <th className='text-left p-4 text-sm font-medium'>Input (por 1M)</th>
                                    <th className='text-left p-4 text-sm font-medium'>Output (por 1M)</th>
                                  </tr>
                                </thead>
                                <tbody className='text-sm'>
                                  {models.length > 0 ? (
                                    models
                                      .filter((model) => model && model.model)
                                      .sort((a, b) => {
                                        const modelA = a?.model || ''
                                        const modelB = b?.model || ''
                                        return modelA.localeCompare(modelB)
                                      })
                                      .slice(0, 10)
                                      .map((model, i) => (
                                        <tr key={`${provider}-${i}-${model.model}`} className='border-b hover:bg-muted/30 transition-colors'>
                                          <td className='p-4'>
                                            <code className='px-2 py-1 bg-muted rounded text-xs font-mono'>
                                              {model.model}
                                            </code>
                                          </td>
                                          <td className='p-4 text-muted-foreground font-light'>
                                            {model.inputCostPer1m !== null ? `$${model.inputCostPer1m}` : '-'}
                                          </td>
                                          <td className='p-4 text-muted-foreground font-light'>
                                            {model.outputCostPer1m !== null ? `$${model.outputCostPer1m}` : '-'}
                                          </td>
                                        </tr>
                                      ))
                                  ) : (
                                    <tr>
                                      <td colSpan={3} className='p-4 text-center text-sm text-muted-foreground font-light'>
                                        Nenhum modelo encontrado para este provedor.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                            {models.length > 10 && (
                              <p className='text-xs text-muted-foreground font-light'>
                                Mostrando 10 de {models.length} modelos de {provider}.
                              </p>
                            )}
                          </div>
                        ))}
                      
                      <div className='rounded-lg border-l-4 border-primary bg-primary/10 p-6'>
                        <div className='flex gap-3'>
                          <Check className='h-5 w-5 text-primary flex-shrink-0 mt-0.5' />
                          <div className='space-y-2'>
                            <p className='font-medium text-sm'>Preços atualizados</p>
                            <p className='text-sm text-muted-foreground font-light'>
                              Os preços são atualizados automaticamente e sempre refletem os valores mais recentes de cada provedor. 
                              Todos os valores são por 1 milhão de tokens (per 1M tokens).
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className='rounded-lg border-l-4 border-amber-500 bg-amber-500/10 p-6'>
                      <div className='flex gap-3'>
                        <AlertCircle className='h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5' />
                        <div className='space-y-1'>
                          <p className='font-medium text-sm'>Nenhum modelo válido encontrado</p>
                          <p className='text-sm text-muted-foreground font-light'>
                            {prices.length} modelos foram carregados, mas nenhum passou na validação. Verifique se os modelos têm provider e model válidos.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className='rounded-lg border-l-4 border-amber-500 bg-amber-500/10 p-6'>
                  <div className='flex gap-3'>
                    <AlertCircle className='h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5' />
                    <div className='space-y-1'>
                      <p className='font-medium text-sm'>Nenhum modelo disponível</p>
                      <p className='text-sm text-muted-foreground font-light'>
                        {pricesError || 'Não foi possível carregar os modelos no momento.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Erros - Minimalista */}
          <section id='tratamento-erros' className='space-y-8 border-b pb-16 scroll-mt-24'>
            <div className='flex items-center gap-3'>
              <AlertCircle className='h-6 w-6 text-primary' />
              <h2 className='text-3xl font-light tracking-tight'>Tratamento de Erros</h2>
            </div>
            
            <div className='space-y-6'>
              {[
                {
                  status: '401',
                  title: 'Unauthorized',
                  description: 'API key não fornecida, inválida ou expirada. Verifique se a key está ativa e corretamente enviada no header.',
                },
                {
                  status: '404',
                  title: 'Not Found',
                  description: 'Provider, model ou preço não encontrado. Verifique se os nomes estão corretos e se o modelo possui preços cadastrados.',
                },
                {
                  status: '400',
                  title: 'Bad Request',
                  description: 'Validação falhou. Verifique campos obrigatórios, tipos de dados e se tokens são números >= 0.',
                },
              ].map((error, i) => (
                <div key={i} className='group space-y-2 p-6 rounded-lg hover:bg-muted/50 transition-colors border-l-4 border-primary/20'>
                  <div className='flex items-center gap-3'>
                    <Badge variant='destructive' className='font-mono'>{error.status}</Badge>
                    <h3 className='text-lg font-medium group-hover:text-primary transition-colors'>{error.title}</h3>
                  </div>
                  <p className='text-sm text-muted-foreground font-light leading-relaxed ml-16'>{error.description}</p>
                </div>
              ))}
              
              <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Exemplo de erro</h3>
                <CodeBlock code={`{
  "success": false,
  "error": "API key not found or invalid",
  "statusCode": 401
}`} />
              </div>
            </div>
          </section>


          {/* Campos Opcionais - Minimalista */}
          <section id='campos-opcionais' className='space-y-8 border-b pb-16 scroll-mt-24'>
            <h2 className='text-3xl font-light tracking-tight'>Campos Opcionais</h2>
            
            <div className='grid sm:grid-cols-2 gap-6'>
              <div className='group space-y-4 p-6 rounded-lg hover:bg-muted/50 transition-colors border'>
                <h3 className='text-lg font-medium group-hover:text-primary transition-colors'>Feature</h3>
                <p className='text-sm text-muted-foreground font-light leading-relaxed'>
                  Campo livre para descrever a funcionalidade do uso:
                </p>
                <div className='flex flex-wrap gap-2'>
                  {['chat', 'completion', 'embedding', 'fine-tuning', 'translation'].map((feat) => (
                    <Badge key={feat} variant='secondary' className='font-mono text-xs'>{feat}</Badge>
                  ))}
                </div>
              </div>
              
              <div className='group space-y-4 p-6 rounded-lg hover:bg-muted/50 transition-colors border'>
                <h3 className='text-lg font-medium group-hover:text-primary transition-colors'>Tags</h3>
                <p className='text-sm text-muted-foreground font-light leading-relaxed'>
                  Array de strings para categorização e filtragem:
                </p>
                <CodeBlock code={`["production", "user-request"]
["staging", "test"]
["internal", "batch-processing"]`} />
              </div>
            </div>
          </section>

          {/* CTA - Minimalista */}
          <section className='text-center space-y-8 py-16'>
            <h2 className='text-3xl font-light tracking-tight'>
              Pronto para começar?
            </h2>
            <p className='text-muted-foreground font-light'>
              Crie sua conta grátis e comece a rastrear seus custos de LLM em minutos.
            </p>
            <Button asChild size='lg' className='px-8 py-6 text-base font-normal h-auto rounded-full hover:scale-105 transition-transform duration-300'>
              <Link to='/sign-up'>
                Criar conta grátis
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </section>
          </div>
        </div>
      </main>

      {/* Footer Minimalista */}
      <footer className='py-12 border-t'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-light'>
            <p>© 2024 LLM Cost Radar</p>
            <div className='flex gap-6'>
              <Link to='/landing' className='hover:text-foreground transition-colors'>
                Landing
              </Link>
              <Link to='/documentation' className='hover:text-foreground transition-colors'>
                Documentação
              </Link>
              <Link to='/sign-in' className='hover:text-foreground transition-colors'>
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
