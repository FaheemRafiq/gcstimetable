import React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { IdCardIcon } from 'lucide-react'

export interface CNICInputProps {
  value: string
  onChange: (value: string) => void
  setError?: (error: string) => void
  placeholder?: string
  className?: string
  inputId?: string
}

const CNICInput: React.FC<CNICInputProps> = ({
  value,
  onChange,
  setError,
  placeholder = 'i.e XXXXX-XXXXXXX-X',
  className,
  inputId = 'cnic',
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value

    // Remove non-numeric characters
    inputValue = inputValue.replace(/[^0-9]/g, '')

    // Insert hyphens at the correct positions
    if (inputValue.length > 5 && inputValue.length <= 12) {
      inputValue = `${inputValue.slice(0, 5)}-${inputValue.slice(5)}`
    }
    if (inputValue.length > 12) {
      inputValue = `${inputValue.slice(0, 5)}-${inputValue.slice(5, 12)}-${inputValue.slice(12, 13)}`
    }

    onChange(inputValue)

    // Validate format: XXXXX-XXXXXXX-X
    if (setError) {
      if (/^\d{5}-\d{7}-\d{1}$/.test(inputValue) || inputValue === '') {
        setError('') // Valid format or empty
      } else {
        setError('Invalid CNIC format. Use XXXXX-XXXXXXX-X.')
      }
    }
  }

  return (
    <div className="relative">
      <Input
        id={inputId}
        className={cn('w-full rounded border p-2 peer ps-9', className)}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
      />
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
        <IdCardIcon size={16} strokeWidth={2} aria-hidden="true" />
      </div>
    </div>
  )
}

export { CNICInput }
