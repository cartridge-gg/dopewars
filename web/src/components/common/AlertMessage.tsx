import { cn } from "@/utils/cn";
import { Warning } from "../icons";

interface AlertMessageProps {
  message: string;
  className?: string;
}

export const AlertMessage = ({ message, className }: AlertMessageProps) => (
  <div className={cn("flex items-center justify-center w-full relative py-3 gap-2", className)}>
    <Warning size="md" />
    <span>{message}</span>
  </div>
);
