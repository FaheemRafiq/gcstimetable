import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface AutoCompleteProps {
    label: string;
    value: string | null;
    setValue: (value: string) => void;
    values: { value: string; label: string }[];
    disabled?: boolean;
    isError?: boolean;
}

export function AutoCompleteSelect({
    label,
    value,
    setValue,
    values,
    disabled,
    isError = false,
}: AutoCompleteProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                asChild
                className={cn({
                    "border-destructive": isError,
                })}
            >
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between w-full focus-visible::ring-0"
                    disabled={disabled}
                >
                    {Boolean(value)
                        ? (() => {
                              return values.find(
                                  (framework) => framework.value == value
                              )?.label;
                          })()
                        : label}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command
                    filter={(value, search, keywords = []) => {
                        const extendValue = value + " " + keywords.join(" ");
                        if (
                            extendValue
                                .toLowerCase()
                                .includes(search.toLowerCase())
                        ) {
                            return 1;
                        }
                        return 0;
                    }}
                >
                    <CommandInput
                        className="border-transparent focus:border-transparent focus:ring-transparent"
                        placeholder={label}
                    />
                    <CommandList>
                        <CommandEmpty>Not found.</CommandEmpty>
                        <CommandGroup>
                            {values.map((framework) => (
                                <CommandItem
                                    key={framework.value}
                                    value={framework.value}
                                    onSelect={(currentValue) => {
                                        setValue(
                                            currentValue === value
                                                ? ""
                                                : currentValue
                                        );
                                        setOpen(false);
                                    }}
                                    keywords={[framework.label]}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === framework.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {framework.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
