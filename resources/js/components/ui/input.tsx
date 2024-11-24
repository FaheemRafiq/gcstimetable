import * as React from "react";

import { cn } from "@/lib/utils";
import { Icon } from "../app-sidebar";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    startIcon?: Icon;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        { startIcon: StartIcon, className, type, ...props },
        ref
    ) => {
        return (
            <div className={"relative w-full"}>
                {StartIcon && (
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <StartIcon size={18} className="text-sm" />
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                        className,
                        {
                            "ps-10": StartIcon,
                        }
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };