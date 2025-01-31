import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; // Add this import
import { cn } from "@/lib/utils";
import { LoaderCircle, Search } from "lucide-react";
import { useEffect, useId, useState } from "react";

interface SearchInputProps {
    label?: string;
    placeholder?: string;
    value: string;
    onSearch: (query: string) => void;
    className?: string;
}

export default function SearchInput({
    label = "Search",
    placeholder = "Search...",
    value,
    onSearch,
    className
}: SearchInputProps) {
    const id = useId();
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        onSearch(inputValue);
        setIsLoading(false);
    };

    useEffect(() => {
        setInputValue(value);
    }, [value]);

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
                        onChange={(e) => setInputValue(e.target.value)}
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
                <Button type="submit" disabled={isLoading}>
                    Search
                </Button>
            </form>
        </div>
    );
}
