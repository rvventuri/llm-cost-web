'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Copy, Check, Loader2 } from 'lucide-react'
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
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import type { ApiKey } from '@/lib/api-keys-api'
import {
  createApiKey,
  updateApiKey,
  type CreateApiKeyResponse,
} from '@/lib/api-keys-api'
import { cn } from '@/lib/utils'

const createFormSchema = z.object({
  name: z.string().optional(),
  expiresAt: z.string().optional(),
})

const updateFormSchema = z.object({
  name: z.string().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.string().optional().nullable(),
})

type CreateFormValues = z.infer<typeof createFormSchema>
type UpdateFormValues = z.infer<typeof updateFormSchema>

type ApiKeyActionDialogProps = {
  currentRow?: ApiKey
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ApiKeysActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: ApiKeyActionDialogProps) {
  const isEdit = !!currentRow
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedCurl, setCopiedCurl] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: '',
      expiresAt: '',
    },
  })

  const updateForm = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.name || '',
          isActive: currentRow.isActive,
          expiresAt: currentRow.expiresAt || null,
        }
      : {
          name: '',
          isActive: true,
          expiresAt: null,
        },
  })

  const form = isEdit ? updateForm : createForm

  const onSubmit = async (values: CreateFormValues | UpdateFormValues) => {
    setIsLoading(true)
    try {
      if (isEdit) {
        const updateValues = values as UpdateFormValues
        await updateApiKey(currentRow!.id, {
          name: updateValues.name || undefined,
          isActive: updateValues.isActive,
          expiresAt: updateValues.expiresAt === '' ? null : updateValues.expiresAt || undefined,
        })
        toast.success('API key atualizada com sucesso!')
        form.reset()
        onOpenChange(false)
        onSuccess()
      } else {
        const createValues = values as CreateFormValues
        const response: CreateApiKeyResponse = await createApiKey({
          name: createValues.name || undefined,
          expiresAt: createValues.expiresAt || undefined,
        })
        setCreatedApiKey(response.apiKey)
        toast.success('API key criada com sucesso!')
        onSuccess()
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao processar solicitação'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyApiKey = async () => {
    if (createdApiKey) {
      await navigator.clipboard.writeText(createdApiKey)
      setCopied(true)
      toast.success('API key copiada para a área de transferência!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getCurlExample = () => {
    if (!createdApiKey) return ''
    return `curl -X POST ${API_BASE_URL}/track-llm \\
  -H "x-api-key: ${createdApiKey}" \\
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

  const handleCopyCurl = async () => {
    const curlExample = getCurlExample()
    if (curlExample) {
      await navigator.clipboard.writeText(curlExample)
      setCopiedCurl(true)
      toast.success('Exemplo cURL copiado para a área de transferência!')
      setTimeout(() => setCopiedCurl(false), 2000)
    }
  }

  const handleClose = () => {
    form.reset()
    setCreatedApiKey(null)
    setCopied(false)
    setCopiedCurl(false)
    onOpenChange(false)
  }

  // Se a API key foi criada, mostrar tela de sucesso
  if (createdApiKey) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader className='text-start'>
            <DialogTitle>API Key Criada com Sucesso!</DialogTitle>
            <DialogDescription>
              Copie sua API key agora. Ela não será exibida novamente.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label>API Key</Label>
              <div className='flex items-center gap-2'>
                <Input
                  value={createdApiKey}
                  readOnly
                  className='font-mono text-sm'
                />
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={handleCopyApiKey}
                >
                  {copied ? (
                    <Check className='h-4 w-4 text-green-500' />
                  ) : (
                    <Copy className='h-4 w-4' />
                  )}
                </Button>
              </div>
              <p className='text-sm text-muted-foreground'>
                Esta é a única vez que você verá esta API key. Certifique-se de
                salvá-la em um local seguro.
              </p>
            </div>

            <div className='space-y-3 pt-4 border-t'>
              <Label>Exemplo de uso com cURL</Label>
              <div className='relative'>
                <pre className='bg-muted/50 rounded-lg p-4 overflow-x-auto text-sm font-mono border max-h-48 whitespace-pre-wrap break-words'>
                  <code className='block'>{getCurlExample()}</code>
                </pre>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute top-2 right-2'
                  onClick={handleCopyCurl}
                >
                  {copiedCurl ? (
                    <Check className='h-4 w-4 text-green-500' />
                  ) : (
                    <Copy className='h-4 w-4' />
                  )}
                </Button>
              </div>
              <p className='text-sm text-muted-foreground'>
                Copie o comando acima e execute no seu terminal para enviar seu primeiro evento.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleClose}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          handleClose()
        }
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Editar API Key' : 'Criar Nova API Key'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize as informações da API key aqui.'
              : 'Crie uma nova API key para sua organização.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ex: API Key Produção'
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Um nome descritivo para identificar esta API key.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEdit && (
              <FormField
                control={form.control}
                name='isActive'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Status</FormLabel>
                      <FormDescription>
                        Desative a API key para impedir seu uso sem deletá-la.
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

            <FormField
              control={form.control}
              name='expiresAt'
              render={({ field }) => {
                // Converter para formato datetime-local
                const getValue = () => {
                  if (!field.value) return ''
                  try {
                    const date = new Date(field.value)
                    // Ajustar para timezone local
                    const year = date.getFullYear()
                    const month = String(date.getMonth() + 1).padStart(2, '0')
                    const day = String(date.getDate()).padStart(2, '0')
                    const hours = String(date.getHours()).padStart(2, '0')
                    const minutes = String(date.getMinutes()).padStart(2, '0')
                    return `${year}-${month}-${day}T${hours}:${minutes}`
                  } catch {
                    return ''
                  }
                }

                return (
                  <FormItem>
                    <FormLabel>
                      Data de Expiração {isEdit ? '(opcional)' : '(opcional)'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='datetime-local'
                        value={getValue()}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value) {
                            // Converter para ISO string
                            const date = new Date(value)
                            field.onChange(date.toISOString())
                          } else {
                            field.onChange(isEdit ? null : undefined)
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      {isEdit
                        ? 'Deixe em branco para remover a data de expiração.'
                        : 'Deixe em branco para que a API key nunca expire.'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )
              }}
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
                {isEdit ? 'Salvar Alterações' : 'Criar API Key'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
