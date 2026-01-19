import { useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LeadDialog } from './components/lead-dialog'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/ month',
    events: 'Up to 1,000 events / month',
    projects: '1 API key',
    features: [
      'Cost per model',
      'Daily cost overview',
      'Last requests history',
      'Canonical model normalization',
      'Price catalog (read-only)',
      'Data delayed (up to 24h)',
      'Community support',
    ],
    highlighted: false,
  },
  {
    name: 'Starter',
    price: '$29',
    period: '/ month',
    events: 'Up to 10,000 events / month',
    projects: '3 API keys',
    features: [
      'Cost per model',
      'Cost per feature / endpoint',
      'Daily & weekly trends',
      'Usage spike alerts (+20%)',
      'Near real-time ingestion',
      'CSV export',
      'Email support',
    ],
    highlighted: true,
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/ month',
    events: 'Up to 50,000 events / month',
    projects: '10 API keys',
    features: [
      'Advanced dashboards',
      'Custom alerts & thresholds',
      'Cost projections',
      'Historical data (12 months)',
      'API access (read)',
      'Webhook notifications',
      'Priority support',
    ],
    highlighted: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom pricing',
    period: '',
    events: 'Unlimited events',
    projects: 'Unlimited projects & environments',
    features: [
      'SLA & dedicated support',
      'SSO (SAML / OIDC)',
      'Budget rules per feature',
      'Cost allocation by team',
      'Custom integrations',
      'On-prem / VPC options',
    ],
    highlighted: false,
    custom: true,
  },
]

export function Plans() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName)
    setIsDialogOpen(true)
  }

  return (
    <div className='min-h-screen bg-background'>
      <main className='container mx-auto px-4 py-12'>
        <div className='max-w-6xl mx-auto space-y-16'>
          {/* Header */}
          <div className='text-center space-y-6'>
            <Badge
              variant='outline'
              className='px-4 py-1.5 text-xs font-normal border-primary/20 bg-background/50'
            >
              Pricing
            </Badge>
            <h1 className='text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight'>
              Planos de <span className='font-medium text-primary'>Assinatura</span>
            </h1>
            <p className='text-lg text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed'>
              Escolha o plano ideal para sua necessidade. Todos os planos incluem rastreamento
              básico de custos sem SDK obrigatório.
            </p>
          </div>

          {/* Plans Grid */}
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col transition-all duration-300 ${
                  plan.highlighted
                    ? 'border-primary/50 shadow-lg scale-105'
                    : 'hover:border-primary/30 hover:shadow-md'
                }`}
              >
                {plan.highlighted && (
                  <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                    <Badge className='bg-primary text-primary-foreground'>
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className='pb-4'>
                  <CardTitle className='text-2xl font-light'>{plan.name}</CardTitle>
                  <div className='flex items-baseline gap-1 pt-2'>
                    <span className='text-4xl font-medium'>{plan.price}</span>
                    <span className='text-muted-foreground font-light'>{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className='flex-1 space-y-6'>
                  <div className='space-y-2 text-sm'>
                    <div className='flex items-center gap-2 text-muted-foreground font-light'>
                      <Sparkles className='h-4 w-4' />
                      <span>{plan.events}</span>
                    </div>
                    <div className='flex items-center gap-2 text-muted-foreground font-light'>
                      <Sparkles className='h-4 w-4' />
                      <span>{plan.projects}</span>
                    </div>
                  </div>

                  <div className='space-y-3 pt-4 border-t'>
                    {plan.features.map((feature, index) => (
                      <div key={index} className='flex items-start gap-3'>
                        <Check className='h-4 w-4 text-primary flex-shrink-0 mt-0.5' />
                        <span className='text-sm font-light leading-relaxed'>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full mt-8 rounded-full font-light ${
                      plan.highlighted
                        ? 'bg-primary hover:bg-primary/90'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                    disabled={plan.custom}
                    onClick={() => !plan.custom && handleSelectPlan(plan.name)}
                  >
                    {plan.custom ? 'Contate-nos' : 'Escolher Plano'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Notes */}
          <div className='max-w-3xl mx-auto space-y-8'>
            <div className='text-center space-y-4'>
              <h2 className='text-2xl font-light tracking-tight'>Notas Importantes</h2>
              <div className='grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground font-light'>
                <div className='flex items-start gap-2 p-4 rounded-lg bg-muted/30 border'>
                  <span className='font-medium text-foreground'>1 evento</span> = 1 requisição
                  LLM
                </div>
                <div className='flex items-start gap-2 p-4 rounded-lg bg-muted/30 border'>
                  <span className='font-medium text-foreground'>Sem SDK</span> obrigatório
                </div>
                <div className='flex items-start gap-2 p-4 rounded-lg bg-muted/30 border'>
                  <span className='font-medium text-foreground'>Qualquer provider</span> (OpenAI,
                  Anthropic, Gemini, Mistral, etc.)
                </div>
                <div className='flex items-start gap-2 p-4 rounded-lg bg-muted/30 border'>
                  <span className='font-medium text-foreground'>Sem limites de tokens</span>
                </div>
                <div className='flex items-start gap-2 p-4 rounded-lg bg-muted/30 border sm:col-span-2'>
                  <span className='font-medium text-foreground'>Upgrade a qualquer momento</span>{' '}
                  conforme seu uso cresce
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className='text-center space-y-4 pt-8 border-t'>
            <p className='text-muted-foreground font-light'>
              Não tem certeza qual plano escolher? Entre em contato e ajudaremos você.
            </p>
            <Button variant='outline' className='rounded-full font-light'>
              Falar com Vendas
            </Button>
          </div>
        </div>
      </main>

      <LeadDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedPlan={selectedPlan}
      />
    </div>
  )
}
