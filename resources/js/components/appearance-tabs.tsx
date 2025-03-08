import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type LucideIcon, Monitor, Moon, Sun } from 'lucide-react'
import { useTheme, type Theme } from '@/components/theme-provider'

export default function AppearanceToggleTab() {
  const { theme, setTheme } = useTheme()

  const tabs: { value: Theme; icon: LucideIcon; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ]

  return (
    <Tabs defaultValue={theme} onValueChange={value => setTheme(value as Theme)} className="w-full">
      <TabsList className="inline-flex gap-1 rounded-lg bg-neutral-200/75 p-1 dark:bg-[#111827]">
        {tabs.map(({ value, icon: Icon, label }) => (
          <TabsTrigger key={value} value={value} className="flex items-center gap-2 px-3.5 py-1.5">
            <Icon className="h-4 w-4" />
            <span className="text-sm">{label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
