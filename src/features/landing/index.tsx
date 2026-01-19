import { ArrowRight, Check, TrendingUp, Zap, BarChart3, Clock, Sparkles, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'

export function Landing() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Header - Minimalista */}
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto px-4'>
          <div className='flex h-16 items-center justify-between'>
            {/* Logo/Brand */}
            <Link to='/landing' className='flex items-center space-x-2'>
              <div className='text-lg font-medium tracking-tight'>LLM Cost Radar</div>
            </Link>
            
            {/* Navigation */}
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

      {/* Hero Section - Minimalista */}
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden border-b'>
        {/* Background sutil */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)]' />
        
        <div className='container mx-auto px-4 py-20 relative z-10'>
          <div className='max-w-4xl mx-auto text-center space-y-8 transition-all duration-1000 opacity-100 translate-y-0'>
            {/* Badge minimalista */}
            <Badge 
              variant='outline' 
              className='mb-4 px-4 py-1.5 text-xs font-normal tracking-wide border-primary/20 bg-background/50 backdrop-blur-sm'
            >
              FinOps for LLMs
            </Badge>
            
            {/* Headline principal */}
            <h1 className='text-5xl sm:text-6xl md:text-7xl font-light tracking-tight leading-tight'>
              Você sabe quanto custa
              <br />
              <span className='font-medium text-primary'>cada resposta do seu LLM?</span>
            </h1>
            
            {/* Subheadline */}
            <p className='text-xl sm:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed'>
              LLMs são baratos... até irem para produção.
              <br />
              Ganhe visibilidade e controle — sem refatorar nada.
            </p>
            
            {/* CTA Principal */}
            <div className='flex justify-center items-center pt-4'>
              <Button 
                asChild 
                size='lg' 
                className='px-8 py-6 text-base font-normal h-auto rounded-full hover:scale-105 transition-transform duration-300'
              >
                <Link to='/sign-up'>
                  Comece agora
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </div>
            
            {/* Features inline minimalistas */}
            <div className='flex flex-wrap justify-center gap-6 pt-8 text-sm text-muted-foreground'>
              <span className='flex items-center gap-2'>
                <Clock className='h-4 w-4' />
                5 minutos
              </span>
              <span className='flex items-center gap-2'>
                <Zap className='h-4 w-4' />
                Sem SDK
              </span>
              <span className='flex items-center gap-2'>
                <Check className='h-4 w-4' />
                Sem lock-in
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Problema - Minimalista */}
      <section className='py-32 border-b'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto space-y-16'>
            <div className='text-center space-y-4'>
              <h2 className='text-4xl sm:text-5xl font-light tracking-tight'>
                O problema real
              </h2>
              <p className='text-lg text-muted-foreground font-light max-w-xl mx-auto'>
                Sem visibilidade, não existe controle. Quando você percebe, já passou do budget.
              </p>
            </div>
            
            <div className='grid sm:grid-cols-2 gap-8'>
              {[
                {
                  title: 'Custos imprevisíveis',
                  description: 'A fatura chega e você descobre que gastou 3x mais do que esperava.',
                },
                {
                  title: 'Zero visibilidade',
                  description: 'Não sabe qual feature custa mais. Qual endpoint está drenando o budget.',
                },
                {
                  title: 'Tokens explodindo',
                  description: 'Tokens de saída crescendo sem controle. Modelos premium sem critério.',
                },
                {
                  title: 'Descoberta tardia',
                  description: 'Logs técnicos não mostram impacto financeiro. Cloud billing não separa.',
                },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className='group space-y-2 p-6 rounded-lg hover:bg-muted/50 transition-colors duration-300'
                >
                  <h3 className='text-lg font-medium group-hover:text-primary transition-colors'>
                    {item.title}
                  </h3>
                  <p className='text-sm text-muted-foreground font-light leading-relaxed'>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Por que - Minimalista */}
      <section className='py-32 border-b bg-muted/30'>
        <div className='container mx-auto px-4'>
          <div className='max-w-2xl mx-auto space-y-12'>
            <h2 className='text-4xl sm:text-5xl font-light tracking-tight text-center'>
              Por que isso acontece?
            </h2>
            
            <div className='space-y-8'>
              {[
                {
                  number: '01',
                  title: 'LLMs cobram por token',
                  description: 'Preços variam drasticamente por modelo e provider. Um modelo premium pode custar 10x mais.',
                },
                {
                  number: '02',
                  title: 'Nomes de modelos mudam',
                  description: 'Versões novas, nomes diferentes. Sem normalização, é impossível comparar.',
                },
                {
                  number: '03',
                  title: 'Logs técnicos ≠ visão financeira',
                  description: 'Cloud billing mostra o total, não o impacto por feature, por modelo ou endpoint.',
                },
              ].map((item, i) => (
                <div key={i} className='flex gap-8 group'>
                  <div className='flex-shrink-0'>
                    <span className='text-sm font-mono text-muted-foreground group-hover:text-primary transition-colors'>
                      {item.number}
                    </span>
                  </div>
                  <div className='flex-1 space-y-2'>
                    <h3 className='text-xl font-medium group-hover:text-primary transition-colors'>
                      {item.title}
                    </h3>
                    <p className='text-sm text-muted-foreground font-light leading-relaxed'>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className='pt-8 border-t'>
              <p className='text-lg font-light text-center'>
                <span className='font-medium'>Conclusão:</span> Sem visibilidade, não existe controle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solução - Minimalista */}
      <section className='py-32 border-b'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto text-center space-y-8'>
            <Badge 
              variant='outline' 
              className='px-4 py-1.5 text-xs font-normal border-primary/20 bg-background/50'
            >
              A Solução
            </Badge>
            
            <h2 className='text-4xl sm:text-5xl font-light tracking-tight'>
              LLM Cost Radar
            </h2>
            
            <p className='text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed'>
              Monitore, entenda e controle seus custos de IA em tempo real — sem SDK obrigatório, sem lock-in.
            </p>
            
            <div className='flex flex-wrap justify-center gap-3 pt-4'>
              {['Qualquer stack', 'Qualquer provider', 'Zero refatoração', 'Setup em minutos'].map((badge, i) => (
                <Badge 
                  key={i} 
                  variant='secondary' 
                  className='px-4 py-1.5 text-xs font-normal rounded-full border-0 bg-muted/50'
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona - Minimalista */}
      <section className='py-32 border-b bg-muted/30'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto space-y-16'>
            <h2 className='text-4xl sm:text-5xl font-light tracking-tight text-center'>
              Como funciona
            </h2>
            
            <div className='grid sm:grid-cols-3 gap-12'>
              {[
                {
                  number: '1',
                  title: 'Gere uma API Key',
                  description: 'Crie sua conta e gere uma API key em segundos. Sem cartão de crédito.',
                  icon: Sparkles,
                },
                {
                  number: '2',
                  title: 'Envie eventos',
                  description: 'Endpoint HTTP simples. Funciona com curl, qualquer linguagem.',
                  icon: BarChart3,
                },
                {
                  number: '3',
                  title: 'Veja custos em tempo real',
                  description: 'Dashboard imediato. Custo por modelo, por feature, tendências.',
                  icon: TrendingUp,
                },
              ].map((item, i) => (
                <div key={i} className='group space-y-4 text-center'>
                  <div className='inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/20 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-300'>
                    <span className='text-lg font-light text-primary'>{item.number}</span>
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
          </div>
        </div>
      </section>

      {/* Benefícios - Minimalista */}
      <section className='py-32 border-b'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto space-y-12'>
            <h2 className='text-4xl sm:text-5xl font-light tracking-tight text-center'>
              O que você passa a enxergar
            </h2>
            
            <div className='grid sm:grid-cols-2 gap-6'>
              {[
                'Custo por modelo',
                'Custo por feature',
                'Custo diário e tendências',
                'Picos de uso',
                'Projeção mensal',
                'Alertas de risco',
              ].map((benefit, i) => (
                <div 
                  key={i} 
                  className='flex items-start gap-3 group p-3 rounded-lg hover:bg-muted/50 transition-colors'
                >
                  <Check className='h-5 w-5 flex-shrink-0 text-primary mt-0.5 group-hover:scale-110 transition-transform' />
                  <span className='text-sm font-light'>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prova Social - Minimalista */}
      <section className='py-32 border-b bg-muted/30'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto text-center space-y-12'>
            <h2 className='text-4xl sm:text-5xl font-light tracking-tight'>
              Economize até{' '}
              <span className='font-medium text-primary'>30–80%</span>
              <br />
              apenas com visibilidade
            </h2>
            
            <div className='grid sm:grid-cols-3 gap-8 pt-8'>
              {[
                { label: 'Minutos', description: 'Descubra custos invisíveis' },
                { label: 'Sem surpresas', description: 'Evite sustos na fatura' },
                { label: 'Production-ready', description: 'Feito para sistemas reais' },
              ].map((item, i) => (
                <div key={i} className='space-y-2'>
                  <div className='text-2xl font-light'>{item.label}</div>
                  <div className='text-sm text-muted-foreground font-light'>{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final - Minimalista */}
      <section className='py-32 border-b'>
        <div className='container mx-auto px-4'>
          <div className='max-w-2xl mx-auto text-center space-y-8'>
            <h2 className='text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight'>
              Pare de adivinhar
              <br />
              <span className='font-medium'>seus custos de IA</span>
            </h2>
            
            <p className='text-xl text-muted-foreground font-light'>
              Tenha controle antes que escale. Comece agora — menos de 5 minutos.
            </p>
            
            <Button 
              asChild 
              size='lg' 
              className='px-8 py-6 text-base font-normal h-auto rounded-full hover:scale-105 transition-transform duration-300'
            >
              <Link to='/sign-up'>
                Start monitoring your LLM costs
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            
            <div className='flex flex-wrap justify-center gap-6 pt-4 text-sm text-muted-foreground font-light'>
              <span>Sem cartão de crédito</span>
              <span>•</span>
              <span>Setup em minutos</span>
              <span>•</span>
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className='py-12 border-t'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-light'>
            <p>© 2024 LLM Cost Radar</p>
            <div className='flex gap-6'>
              <Link to='/documentation' className='hover:text-foreground transition-colors'>
                Documentação
              </Link>
              <Link to='/sign-in' className='hover:text-foreground transition-colors'>
                Entrar
              </Link>
              <Link to='/sign-up' className='hover:text-foreground transition-colors'>
                Começar grátis
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
