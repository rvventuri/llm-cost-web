import { z } from 'zod'
import type { Budget } from '@/lib/budgets-api'

// Schema para validação
export const budgetSchema = z
  .object({
    name: z
      .string()
      .min(1, 'O nome é obrigatório')
      .min(2, 'O nome deve ter pelo menos 2 caracteres'),
    description: z.string().optional().nullable(),
    amount: z
      .number()
      .min(0, 'O valor deve ser maior ou igual a zero')
      .positive('O valor deve ser maior que zero'),
    type: z.enum(['tokens', 'usd'], {
      message: 'O tipo é obrigatório',
    }),
    period: z.enum(['daily', 'weekly', 'monthly'], {
      message: 'O período é obrigatório',
    }),
    featureId: z.number().optional().nullable(),
    tagId: z.number().optional().nullable(),
    modelId: z.number().optional().nullable(),
    providerId: z.number().optional().nullable(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      // Apenas um filtro pode ser usado por vez
      const filters = [
        data.featureId,
        data.tagId,
        data.modelId,
        data.providerId,
      ].filter((f) => f !== null && f !== undefined)
      return filters.length <= 1
    },
    {
      message: 'Apenas um filtro pode ser usado por vez (feature, tag, model ou provider)',
      path: ['featureId'],
    }
  )

export type BudgetFormValues = z.infer<typeof budgetSchema>
export type { Budget }
