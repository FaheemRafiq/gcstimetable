import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LoaderCircle, Search } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { debounce } from 'lodash' // ✅ Import debounce from lodash

interface SearchInputProps {
  label?: string
  placeholder?: string
  value?: string
  setValue?: (key: string) => void
  className?: string
  autoSearch?: boolean
  debounceDelay?: number
}

export default function SearchInput({
  label = 'Search',
  placeholder = 'Search...',
  value: inputValue = '',
  setValue: setInputValue = () => {},
  className,
  autoSearch = false,
  debounceDelay = 300,
}: SearchInputProps) {
  const id = useId()
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState(inputValue)

  useEffect(() => {
    if (inputValue && !search) {
      setSearch(inputValue)
    }
  }, [inputValue])

  // ✅ Debounce function to send data after delay
  const debouncedSetValue = debounce((newValue: string) => {
    setInputValue(newValue)
    setIsLoading(false)
  }, debounceDelay)

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearch(newValue)

    if (autoSearch) {
      setIsLoading(true)
      debouncedSetValue(newValue) // ✅ Calls `setValue` only after debounce time
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!autoSearch) {
      setInputValue(search)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className={cn('relative flex-1', className)}>
          <Input
            id={id}
            className="peer ps-9 placeholder:overflow-ellipsis"
            placeholder={placeholder}
            type="search"
            value={search}
            onChange={handleChange}
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
            {isLoading ? (
              <LoaderCircle
                className="animate-spin"
                size={16}
                strokeWidth={2}
                role="status"
                aria-label="Loading..."
              />
            ) : (
              <Search size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </div>
        </div>
        {!autoSearch && (
          <Button type="submit" disabled={isLoading}>
            Search
          </Button>
        )}
      </form>
    </div>
  )
}
