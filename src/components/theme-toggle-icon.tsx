import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/theme-provider'

export function ThemeToggleIcon() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }

  // Mantém a meta theme-color em sincronia com o tema atual
  useEffect(() => {
    const themeColor = resolvedTheme === 'dark' ? '#020817' : '#ffffff'
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor)
    }
  }, [resolvedTheme])

  return (
    <Button
      variant='ghost'
      size='icon'
      className='scale-95 rounded-full'
      type='button'
      onClick={toggleTheme}
      aria-label='Alternar tema'
    >
      <Sun
        className='size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0'
      />
      <Moon
        className='absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100'
      />
    </Button>
  )
}

