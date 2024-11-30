import { PropsWithChildren } from "react";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Modal({
    children,
    show = false,
    maxWidth = "2xl",
    closeable = true,
    onClose = () => {},
    className = "",
}: PropsWithChildren<{
    show: boolean;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
    closeable?: boolean;
    onClose: CallableFunction;
    className?: string;
}>) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
    }[maxWidth];

    return (
        show && (
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 flex overflow-y-auto px-4 py-6 sm:px-0 items-center z-50 transform transition-all"
                onClose={close}
                open={show}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gray-500/75 dark:bg-gray-900/75"
                    onClick={closeable ? close : undefined}
                />

                <motion.div
                    initial={{
                        translateY: "-100%",
                    }}
                    animate={{ translateY: "0%" }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                    }}
                    className={cn(
                        `relative mb-6 border border-border bg-background rounded-lg overflow-hidden shadow-xl sm:w-full sm:mx-auto`,
                        maxWidthClass,
                        className
                    )}
                >
                    {children}
                </motion.div>
            </Dialog>
        )
    );
}
