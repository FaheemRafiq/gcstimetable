import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoaderCircle, Search } from "lucide-react";
import { useEffect, useId, useState } from "react";

interface SearchInputProps {
    label?: string;
    placeholder?: string;
    value?: string; // Made value optional
    setValue?: (key: string) => void;
    onSearch: (query: string) => void;
    className?: string;
    autoSearch?: boolean; // New prop to control behavior
    debounceDelay?: number; // New prop for debounce delay
}

export default function SearchInput({
    label = "Search",
    placeholder = "Search...",
    value: inputValue = "", // Default to an empty string if not provided
    setValue: setInputValue = () => {},
    onSearch,
    className,
    autoSearch = false, // Default to false
    debounceDelay = 300 // Default debounce delay
}: SearchInputProps) {
    const id = useId();
    const [isLoading, setIsLoading] = useState(false);
    
    // Debounce function
    const debounce = (func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const handleSearch = (query: string) => {
        setIsLoading(true);
        onSearch(query);
        setIsLoading(false);
    };

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        if (autoSearch) {
            debouncedSearch(newValue);
        }
    };

    // Create a debounced version of the search function
    const debouncedSearch = debounce(handleSearch, debounceDelay);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!autoSearch) {
            handleSearch(inputValue);
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <div className={cn("relative flex-1", className)}>
                    <Input
                        id={id}
                        className="peer ps-9"
                        placeholder={placeholder}
                        type="search"
                        value={inputValue}
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
    );
}
