import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { createBudget, updateBudget, type Budget } from '@/lib/budgets-api'
import { budgetSchema, type BudgetFormValues } from '../data/schema'
import { useBudgets } from './budgets-provider'

type BudgetsActionDialogProps = {
  currentBudget: Budget | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function BudgetsActionDialog({
  currentBudget,
  open,
  onOpenChange,
  onSuccess,
}: BudgetsActionDialogProps) {
  const isEdit = !!currentBudget
  const [isLoading, setIsLoading] = useState(false)
  const [currencyDisplayValue, setCurrencyDisplayValue] = useState('')
  const { closeDialog } = useBudgets()

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      amount: 0,
      type: 'usd',
      period: 'monthly',
      featureId: null,
      tagId: null,
      modelId: null,
      providerId: null,
      isActive: true,
    },
  })

  // Preencher formulário quando editar
  useEffect(() => {
    if (isEdit && currentBudget) {
      const amount = currentBudget.amount
      form.reset({
        name: currentBudget.name,
        description: currentBudget.description || '',
        amount: amount,
        type: currentBudget.type,
        period: currentBudget.period,
        featureId: currentBudget.feature?.id || null,
        tagId: currentBudget.tag?.id || null,
        modelId: currentBudget.model?.id || null,
        providerId: currentBudget.provider?.id || null,
        isActive: currentBudget.isActive,
      })
      // Inicializar valor formatado se for USD
      if (currentBudget.type === 'usd' && amount) {
        setCurrencyDisplayValue(formatCurrency(amount))
      } else {
        setCurrencyDisplayValue('')
      }
    } else {
      form.reset({
        name: '',
        description: '',
        amount: 0,
        type: 'usd',
        period: 'monthly',
        featureId: null,
        tagId: null,
        modelId: null,
        providerId: null,
        isActive: true,
      })
      setCurrencyDisplayValue('')
    }
  }, [isEdit, currentBudget, form])

  // Função para formatar valor como moeda USD
  const formatCurrency = (value: number): string => {
    if (!value || value === 0 || isNaN(value)) return ''
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Função para remover formatação e converter para número
  const parseCurrency = (value: string): number => {
    if (!value || value.trim() === '') return 0
    // Remove símbolos de moeda, espaços e vírgulas (separadores de milhar)
    // Mantém apenas números e ponto decimal
    const cleaned = value
      .replace(/[^\d.]/g, '')
      .replace(/,/g, '')
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : Math.max(0, parsed)
  }

  // Observar o tipo para formatar o campo valor adequadamente
  const watchType = form.watch('type')
  const watchAmount = form.watch('amount')

  // Atualizar display value quando tipo ou valor mudar
  useEffect(() => {
    if (watchType === 'usd') {
      if (watchAmount && watchAmount > 0) {
        setCurrencyDisplayValue(formatCurrency(watchAmount))
      } else {
        setCurrencyDisplayValue('')
      }
    } else {
      setCurrencyDisplayValue('')
    }
  }, [watchType, watchAmount])

  // Observar mudanças nos filtros para garantir que apenas um seja usado
  const watchFilterType = form.watch(['featureId', 'tagId', 'modelId', 'providerId'])

  useEffect(() => {
    const [featureId, tagId, modelId, providerId] = watchFilterType
    const filters = [featureId, tagId, modelId, providerId].filter(
      (f) => f !== null && f !== undefined
    )

    if (filters.length > 1) {
      // Se mais de um filtro está preenchido, limpar todos exceto o último
      const lastFilterIndex = watchFilterType.findIndex(
        (f, i) => f !== null && f !== undefined && i === watchFilterType.lastIndexOf(f)
      )
      if (lastFilterIndex !== -1) {
        // Limpar os outros filtros
        if (lastFilterIndex !== 0) form.setValue('featureId', null)
        if (lastFilterIndex !== 1) form.setValue('tagId', null)
        if (lastFilterIndex !== 2) form.setValue('modelId', null)
        if (lastFilterIndex !== 3) form.setValue('providerId', null)
      }
    }
  }, [watchFilterType, form])

  const onSubmit = async (values: BudgetFormValues) => {
    setIsLoading(true)
    try {
      const payload = {
        name: values.name,
        description: values.description || null,
        amount: values.amount,
        type: values.type,
        period: values.period,
        featureId: values.featureId || null,
        tagId: values.tagId || null,
        modelId: values.modelId || null,
        providerId: values.providerId || null,
        isActive: values.isActive,
      }

      if (isEdit) {
        await updateBudget(currentBudget!.id, payload)
        toast.success('Budget atualizado com sucesso!')
      } else {
        await createBudget(payload)
        toast.success('Budget criado com sucesso!')
      }

      form.reset()
      onOpenChange(false)
      closeDialog()
      onSuccess()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao processar solicitação'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
    closeDialog()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Budget' : 'Criar Budget'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os dados do budget abaixo.'
              : 'Preencha os dados para criar um novo budget.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder='Budget Mensal Geral' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Descrição do budget...'
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione o tipo' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='usd'>USD</SelectItem>
                        <SelectItem value='tokens'>Tokens</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      {watchType === 'usd' ? (
                        <Input
                          type='text'
                          placeholder='$0.00'
                          value={currencyDisplayValue}
                          onChange={(e) => {
                            const inputValue = e.target.value
                            setCurrencyDisplayValue(inputValue)
                            // Parse e atualizar valor numérico
                            const parsed = parseCurrency(inputValue)
                            field.onChange(parsed)
                          }}
                          onBlur={() => {
                            // Formatar no blur
                            const currentValue = field.value || 0
                            if (currentValue > 0) {
                              const formatted = formatCurrency(currentValue)
                              setCurrencyDisplayValue(formatted)
                              field.onChange(currentValue)
                            } else {
                              setCurrencyDisplayValue('')
                            }
                          }}
                        />
                      ) : (
                        <Input
                          type='number'
                          step='any'
                          min='0'
                          placeholder='10000'
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.value
                            if (value === '') {
                              field.onChange(0)
                            } else {
                              const parsed = parseFloat(value)
                              field.onChange(isNaN(parsed) ? 0 : Math.max(0, parsed))
                            }
                          }}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='period'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Período</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione o período' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='daily'>Diário</SelectItem>
                      <SelectItem value='weekly'>Semanal</SelectItem>
                      <SelectItem value='monthly'>Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-2'>
              <FormLabel>Filtro (opcional - apenas um por vez)</FormLabel>
              <FormDescription className='text-xs text-muted-foreground'>
                Selecione apenas um filtro. Deixe todos vazios para budget geral.
              </FormDescription>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='featureId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feature ID</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='ID da feature'
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value ? parseInt(e.target.value) : null)
                          }
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='tagId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag ID</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='ID da tag'
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value ? parseInt(e.target.value) : null)
                          }
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='modelId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model ID</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='ID do modelo'
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value ? parseInt(e.target.value) : null)
                          }
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='providerId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider ID</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='ID do provedor'
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value ? parseInt(e.target.value) : null)
                          }
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {isEdit && (
              <FormField
                control={form.control}
                name='isActive'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Status Ativo</FormLabel>
                      <FormDescription>
                        Desative o budget para parar de aplicá-lo
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                {isEdit ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
