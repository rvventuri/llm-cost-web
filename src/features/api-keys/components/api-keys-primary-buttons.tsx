import { Key } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApiKeys } from './api-keys-provider'

export function ApiKeysPrimaryButtons() {
  const { setOpen } = useApiKeys()
  return (
    <Button className='space-x-1' onClick={() => setOpen('create')}>
      <span>Criar API Key</span> <Key size={18} />
    </Button>
  )
}
