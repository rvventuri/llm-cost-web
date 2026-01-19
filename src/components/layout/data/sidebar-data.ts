import {
  Key,
  BarChart3,
  CreditCard,
  BookOpen,
  LayoutDashboard,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard-llm',
          icon: LayoutDashboard,
        },
        {
          title: 'Logs de eventos',
          url: '/track-llm',
          icon: BarChart3,
        },
        {
          title: 'Planos',
          url: '/plans',
          icon: CreditCard,
        },
        {
          title: 'API Keys',
          url: '/api-keys',
          icon: Key,
        },
        {
          title: 'Documentação',
          url: '/documentation',
          icon: BookOpen,
          external: true,
        },
      ],
    },
  ],
}
