import { z } from 'zod'
import type { ApiKey } from '@/lib/api-keys-api'

// Schema para validação de formulários
export const apiKeyFormSchema = z.object({
  name: z.string().optional(),
  expiresAt: z.string().optional().nullable(),
})

export type ApiKeyFormValues = z.infer<typeof apiKeyFormSchema>

export const updateApiKeyFormSchema = z.object({
  name: z.string().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.string().optional().nullable(),
})

export type UpdateApiKeyFormValues = z.infer<typeof updateApiKeyFormSchema>

// Tipo exportado para uso nos componentes
export type { ApiKey }
