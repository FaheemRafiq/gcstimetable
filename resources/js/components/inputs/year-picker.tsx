import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface YearPickerProps {
    id?: string
    value?: number
    onChange?: (year: number) => void
    startYear?: number
    endYear?: number
    placeholder?: string
    disabled?: boolean
    className?: string
    error?: boolean
}

export function YearPicker({
    id = "year-picker",
    value,
    onChange,
    startYear = 1900,
    endYear = new Date().getFullYear() + 100,
    placeholder = "Select year",
    disabled = false,
    className,
    error = false
}: YearPickerProps) {
    const years = React.useMemo(() => {
        const yearArray = []
        for (let year = startYear; year <= endYear; year++) {
            yearArray.push(year)
        }
        return yearArray
    }, [startYear, endYear])

    const handleYearChange = (yearStr: string) => {
        const year = parseInt(yearStr, 10)
        onChange?.(year)
    }

    return (
        <Select
            value={value?.toString()}
            onValueChange={handleYearChange}
            disabled={disabled}
        >
            <SelectTrigger
                id={id}
                className={cn(
                    error && "border-red-500",
                    className
                )}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {years.map((year) => (
                    <SelectItem
                        key={year}
                        value={year.toString()}
                    >
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default YearPicker