import AppearanceToggleTab from '@/components/appearance-tabs'

export default function ToggleAppearanceTabs({ className = '' }: { className?: string }) {
  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h2 className="text-lg font-medium text-foreground">Appearance</h2>

        <p className="mt-1 text-sm text-foreground/80">Update your account's appearance settings</p>
      </header>

      <AppearanceToggleTab />
    </section>
  )
}
