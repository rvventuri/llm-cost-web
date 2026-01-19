'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
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
import { createLead } from '@/lib/leads-api'

const leadFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ser um endereço válido'),
  telefone: z.string().optional(),
  plano: z.string().min(1, 'Plano é obrigatório'),
})

type LeadFormValues = z.infer<typeof leadFormSchema>

type LeadDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPlan: string | null
}

export function LeadDialog({
  open,
  onOpenChange,
  selectedPlan,
}: LeadDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      email: '',
      telefone: '',
      plano: selectedPlan || '',
    },
  })

  // Atualizar o plano quando selectedPlan mudar
  useEffect(() => {
    if (selectedPlan) {
      form.setValue('plano', selectedPlan)
    }
  }, [selectedPlan, form])

  const onSubmit = async (values: LeadFormValues) => {
    setIsLoading(true)
    try {
      await createLead({
        email: values.email,
        telefone: values.telefone || undefined,
        plano: values.plano,
      })
      toast.success('Solicitação enviada com sucesso! Entraremos em contato em breve.')
      form.reset()
      onOpenChange(false)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao enviar solicitação'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Solicitar Plano</DialogTitle>
          <DialogDescription>
            Preencha suas informações para que possamos entrar em contato sobre o plano selecionado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='plano'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plano</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className='bg-muted' />
                  </FormControl>
                  <FormDescription>
                    Plano selecionado para assinatura
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='seu@email.com'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Email onde entraremos em contato
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='telefone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type='tel'
                      placeholder='+55 11 98765-4321'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Telefone para contato direto (opcional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                Enviar Solicitação
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
