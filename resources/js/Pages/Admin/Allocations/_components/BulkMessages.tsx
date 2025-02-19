import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CircleCheck, X } from "lucide-react";
import { ResponseMessage } from "./MultipleCreateForm";
import { Day } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { getBackgroundColor } from "@/utils/dayHelper";
import { cn } from "@/lib/utils";

interface BulkMessageProps {
  messages: ResponseMessage[];
  days: Day[];
}

export default function BulkMessage({ messages, days }: BulkMessageProps) {
  const [visibleMessages, setVisibleMessages] = useState(messages);

  useEffect(() => {
    if (messages.length > 0) {
      let i = 0;
      const interval = setInterval(() => {
        setVisibleMessages((prev) => prev.filter((msg) => msg.success).slice(1)); // Remove first message one by one
        i++;
        if (i >= messages.length) clearInterval(interval);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [messages]);

  const closeMessage = (dayId: number) => {
    setVisibleMessages((prev) => prev.filter((msg) => msg.day_id !== dayId));
  };

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {visibleMessages.map((msg) => (
          <motion.div
            key={msg.day_id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between w-full p-3 rounded-lg border border-border bg-background shadow-sm"
          >
            <div className="flex items-center gap-2">
              <CircleCheck
                className={msg.success ? "text-emerald-500" : "text-red-500"}
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              <Badge
                className={cn(
                  "pointer-events-none",
                  getBackgroundColor(days.find((day) => day.id === msg.day_id)?.name ?? 'monday')
                )}
              >
                {days.find((day) => day.id === msg.day_id)?.name}
              </Badge>
              <span
                className={cn("text-medium", {
                  "text-emerald-500": msg.success,
                  "text-red-500": !msg.success
                })}
              >
                {msg.message}
              </span>
            </div>
            <Button
              variant="ghost"
              className="group size-6 shrink-0 p-0 hover:bg-transparent"
              aria-label="Close notification"
              onClick={() => closeMessage(msg.day_id)}
            >
              <X
                size={16}
                strokeWidth={2}
                className="opacity-60 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
