import { BookOpen, Code, ArrowRight, Key, Check, AlertCircle, Zap, Copy, CheckCircle2, Loader2, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.llmcostradar.com'

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
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`Failed to load prices: ${response.status} ${response.statusText}`)
        }
        
        const data: PricesResponse = await response.json()
        
        if (data.success && data.data && Array.isArray(data.data)) {
          setPrices(data.data)
        } else {
          setPrices([])
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        setPricesError(
          `We couldn't load the models: ${errorMessage}. Please verify the API is reachable at ${API_BASE_URL}/prices`
        )
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
      return false
    }
    
    // Verificar provider
    const hasValidProvider = model.provider && 
                             model.provider !== 'null' && 
                             model.provider !== null &&
                             typeof model.provider === 'string' &&
                             model.provider.trim() !== ''
    
    if (!hasValidProvider) {
      return false
    }
    
    // Verificar model
    const hasValidModel = model.model && 
                          model.model !== 'null' && 
                          model.model !== null &&
                          typeof model.model === 'string' &&
                          model.model.trim() !== ''
    
    if (!hasValidModel) {
      return false
    }
    
    return true
  })

  const modelsByProvider = validPrices.reduce((acc, model) => {
    const provider = model.provider || 'Unknown'
    if (!acc[provider]) {
      acc[provider] = []
    }
    acc[provider].push(model)
    return acc
  }, {} as Record<string, PriceData[]>)

  const exampleCode = {
    curl: `curl -X POST ${API_BASE_URL}/track-llm \\
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
    
    javascript: `const response = await fetch('${API_BASE_URL}/track-llm', {
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
    '${API_BASE_URL}/track-llm',
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
    
    req, _ := http.NewRequest("POST", "${API_BASE_URL}/track-llm", bytes.NewBuffer(jsonData))
    req.Header.Set("x-api-key", "YOUR_API_KEY")
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()
}`
  }
  
  const sections = [
    { id: 'api-key', title: 'How to get your API key' },
    { id: 'autenticacao', title: 'Authentication' },
    { id: 'endpoint', title: 'Endpoint' },
    { id: 'exemplos-uso', title: 'Usage examples' },
    { id: 'modelos-aceitos', title: 'Supported models' },
    { id: 'tratamento-erros', title: 'Error handling' },
    { id: 'campos-opcionais', title: 'Optional fields' },
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
                to={'/documentation' as any}
                className='flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-light'
              >
                <BookOpen className='h-4 w-4' />
                Documentation
              </Link>
              
              <div className='flex items-center gap-2'>
                <Button asChild variant='ghost' size='sm' className='font-light'>
                  <Link to='/sign-in'>Sign in</Link>
                </Button>
                <Button asChild size='sm' className='font-light rounded-full'>
                  <Link to='/sign-up'>Create account</Link>
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
              <h3 className='text-sm font-medium text-muted-foreground mb-4'>Navigation</h3>
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
              <span className='font-medium text-primary'>API</span> documentation
            </h1>
            <p className='text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed'>
              Track LLM usage events and automatically compute costs. Simple integration, powerful insights, built for FinOps.
            </p>
          </div>

          {/* Como obter API Key - Minimalista */}
          <section id='api-key' className='space-y-8 border-b pb-16 scroll-mt-24'>
            <div className='flex items-center gap-3'>
              <Key className='h-6 w-6 text-primary' />
              <h2 className='text-3xl font-light tracking-tight'>How to get your API key</h2>
            </div>
            
            <div className='space-y-6'>
              <div className='grid sm:grid-cols-3 gap-6'>
                {[
                  {
                    step: '1',
                    title: 'Create your account',
                    description: 'Sign up for free on LLM Cost Radar. No credit card required.',
                  },
                  {
                    step: '2',
                    title: 'Open API Keys',
                    description: 'In the dashboard, go to “API Keys” in the sidebar menu.',
                  },
                  {
                    step: '3',
                    title: 'Generate a new key',
                    description: 'Click “Create API Key”, give it a descriptive name, and save the key shown.',
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
                    <p className='font-medium text-sm'>Important</p>
                    <p className='text-sm text-muted-foreground font-light'>
                      Your full API key is shown only once at creation time. Save it in a safe place. You can generate multiple keys and deactivate them whenever needed.
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
              <h2 className='text-3xl font-light tracking-tight'>Authentication</h2>
            </div>
            
            <div className='space-y-6'>
              <p className='text-muted-foreground font-light leading-relaxed'>
                This API uses <strong className='text-foreground'>API key</strong> authentication (not JWT).
                Send your API key in the request headers using one of the options below:
              </p>
              
              <div className='grid sm:grid-cols-2 gap-4'>
                <div className='space-y-2 p-4 rounded-lg bg-muted/50 border'>
                  <code className='text-sm font-mono font-medium'>x-api-key</code>
                  <p className='text-xs text-muted-foreground font-light'>Recommended</p>
                </div>
                <div className='space-y-2 p-4 rounded-lg bg-muted/50 border'>
                  <code className='text-sm font-mono font-medium'>x-api-token</code>
                  <p className='text-xs text-muted-foreground font-light'>Alternative</p>
                </div>
              </div>
              
              <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Authenticated request example</h3>
                <CodeBlock code={`curl -X POST ${API_BASE_URL}/track-llm \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json"`} />
              </div>
              
              <div className='rounded-lg border-l-4 border-primary bg-primary/10 p-6'>
                <div className='flex gap-3'>
                  <Check className='h-5 w-5 text-primary flex-shrink-0 mt-0.5' />
                  <div className='space-y-2'>
                    <p className='font-medium text-sm'>API key requirements</p>
                    <ul className='text-sm text-muted-foreground font-light space-y-1 list-disc list-inside'>
                      <li>Must be active (<code className='px-1 py-0.5 bg-muted rounded text-xs'>isActive: true</code>)</li>
                      <li>Must not be expired (if <code className='px-1 py-0.5 bg-muted rounded text-xs'>expiresAt</code> is set)</li>
                      <li>Must belong to your organization</li>
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
                Records an LLM usage event and automatically computes the USD cost based on the latest model pricing.
              </p>
              
              {/* Campos do Body */}
              <div className='space-y-6'>
                <h3 className='text-xl font-medium'>Request body fields (JSON)</h3>
                
                <div className='overflow-x-auto border rounded-lg'>
                  <table className='w-full border-collapse'>
                    <thead className='bg-muted/50'>
                      <tr className='border-b'>
                        <th className='text-left p-4 text-sm font-medium'>Field</th>
                        <th className='text-left p-4 text-sm font-medium'>Type</th>
                        <th className='text-left p-4 text-sm font-medium'>Required</th>
                        <th className='text-left p-4 text-sm font-medium'>Description</th>
                      </tr>
                    </thead>
                    <tbody className='text-sm'>
                      {[
                        {
                          field: 'provider',
                          type: 'string',
                          required: true,
                          description: 'Provider name (e.g. "ANTHROPIC", "OPENAI")',
                        },
                        {
                          field: 'model',
                          type: 'string',
                          required: true,
                          description: 'Model name (e.g. "claude-3-5-sonnet-20241022")',
                        },
                        {
                          field: 'tokensIn',
                          type: 'number',
                          required: true,
                          description: 'Input token count (tokensIn), must be >= 0',
                        },
                        {
                          field: 'tokensOut',
                          type: 'number',
                          required: true,
                          description: 'Output token count (tokensOut), must be >= 0',
                        },
                        {
                          field: 'feature',
                          type: 'string',
                          required: false,
                          description: 'Feature name (e.g. "chat", "completion")',
                        },
                        {
                          field: 'tags',
                          type: 'string[]',
                          required: false,
                          description: 'Array of strings for categorization (e.g. ["production", "user-request"])',
                        },
                      ].map((item, i) => (
                        <tr key={i} className='border-b hover:bg-muted/30 transition-colors'>
                          <td className='p-4'><code className='px-2 py-1 bg-muted rounded text-xs font-mono'>{item.field}</code></td>
                          <td className='p-4 text-muted-foreground font-light'>{item.type}</td>
                          <td className='p-4'>
                            {item.required ? (
                              <Badge variant='destructive' className='text-xs'>Yes</Badge>
                            ) : (
                              <Badge variant='secondary' className='text-xs'>No</Badge>
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
                <h3 className='text-xl font-medium'>Examples</h3>
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
                <h3 className='text-xl font-medium'>Successful response (200 OK)</h3>
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
              <h2 className='text-3xl font-light tracking-tight'>Usage examples</h2>
            </div>
            
            <div className='space-y-12'>
              <p className='text-muted-foreground font-light leading-relaxed'>
                Below are practical examples for integrating LLM Cost Radar into your applications.
                They demonstrate how to intercept LLM calls, extract token usage, and send events to our endpoint.
              </p>

              {/* Python com OpenAI */}
              <div className='space-y-4'>
                <h3 className='text-2xl font-light tracking-tight'>Python + OpenAI</h3>
                <p className='text-sm text-muted-foreground font-light leading-relaxed'>
                  Example using the official OpenAI SDK to intercept calls and send metrics:
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
                <h3 className='text-2xl font-light tracking-tight'>Node.js + OpenAI</h3>
                <p className='text-sm text-muted-foreground font-light leading-relaxed'>
                  Example using the official OpenAI SDK for Node.js:
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
                <h3 className='text-2xl font-light tracking-tight'>Python + Anthropic (Claude)</h3>
                <p className='text-sm text-muted-foreground font-light leading-relaxed'>
                  Example using the official Anthropic SDK:
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
                  Example n8n workflow to track LLM usage:
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
                    <p className='font-medium text-sm'>Integration tips</p>
                    <ul className='text-sm text-muted-foreground font-light space-y-1 list-disc list-inside'>
                      <li>Send metrics asynchronously to avoid blocking user responses</li>
                      <li>Use <code className='px-1 py-0.5 bg-muted rounded text-xs'>feature</code> to categorize by functionality (chat, embeddings, etc.)</li>
                      <li>Use <code className='px-1 py-0.5 bg-muted rounded text-xs'>tags</code> to filter by environment (production, staging, test)</li>
                      <li>Keep your API key safe using environment variables</li>
                      <li>Handle errors silently to avoid impacting the user experience</li>
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
              <h2 className='text-3xl font-light tracking-tight'>Supported models</h2>
            </div>
            
            <div className='space-y-6'>
              <p className='text-muted-foreground font-light leading-relaxed'>
                Our API supports a broad range of LLM models across providers. Costs are computed automatically using the most up-to-date pricing for each model.
              </p>

              {loadingPrices ? (
                <div className='flex items-center justify-center py-12'>
                  <Loader2 className='h-6 w-6 animate-spin text-primary' />
                  <span className='ml-3 text-sm text-muted-foreground font-light'>Loading models...</span>
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
                      Total of <strong className='text-foreground'>{validPrices.length}</strong> models available
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
                                    <th className='text-left p-4 text-sm font-medium'>Model</th>
                                    <th className='text-left p-4 text-sm font-medium'>Input (per 1M)</th>
                                    <th className='text-left p-4 text-sm font-medium'>Output (per 1M)</th>
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
                                        No models found for this provider.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                            {models.length > 10 && (
                              <p className='text-xs text-muted-foreground font-light'>
                                Showing 10 of {models.length} models for {provider}.
                              </p>
                            )}
                          </div>
                        ))}
                      
                      <div className='rounded-lg border-l-4 border-primary bg-primary/10 p-6'>
                        <div className='flex gap-3'>
                          <Check className='h-5 w-5 text-primary flex-shrink-0 mt-0.5' />
                          <div className='space-y-2'>
                            <p className='font-medium text-sm'>Up-to-date pricing</p>
                            <p className='text-sm text-muted-foreground font-light'>
                              Prices are updated automatically and always reflect the latest values from each provider.
                              All values are per 1 million tokens (per 1M tokens).
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
                          <p className='font-medium text-sm'>No valid models found</p>
                          <p className='text-sm text-muted-foreground font-light'>
                            {prices.length} models were loaded, but none passed validation. Please verify models have valid provider and model fields.
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
                      <p className='font-medium text-sm'>No models available</p>
                      <p className='text-sm text-muted-foreground font-light'>
                        {pricesError || "We couldn't load models right now."}
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
              <h2 className='text-3xl font-light tracking-tight'>Error handling</h2>
            </div>
            
            <div className='space-y-6'>
              {[
                {
                  status: '401',
                  title: 'Unauthorized',
                  description: 'API key missing, invalid, or expired. Verify the key is active and properly sent in the request headers.',
                },
                {
                  status: '404',
                  title: 'Not Found',
                  description: 'Provider, model, or price not found. Verify names are correct and the model has pricing configured.',
                },
                {
                  status: '400',
                  title: 'Bad Request',
                  description: 'Validation failed. Check required fields, data types, and ensure tokens are numbers >= 0.',
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
                <h3 className='text-lg font-medium'>Error example</h3>
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
            <h2 className='text-3xl font-light tracking-tight'>Optional fields</h2>
            
            <div className='grid sm:grid-cols-2 gap-6'>
              <div className='group space-y-4 p-6 rounded-lg hover:bg-muted/50 transition-colors border'>
                <h3 className='text-lg font-medium group-hover:text-primary transition-colors'>Feature</h3>
                <p className='text-sm text-muted-foreground font-light leading-relaxed'>
                  Free-form field to describe the functionality:
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
                  Array of strings for categorization and filtering:
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
              Ready to get started?
            </h2>
            <p className='text-muted-foreground font-light'>
              Create a free account and start tracking LLM costs in minutes.
            </p>
            <Button asChild size='lg' className='px-8 py-6 text-base font-normal h-auto rounded-full hover:scale-105 transition-transform duration-300'>
              <Link to='/sign-up'>
                Create a free account
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
                Documentation
              </Link>
              <Link to='/sign-in' className='hover:text-foreground transition-colors'>
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
