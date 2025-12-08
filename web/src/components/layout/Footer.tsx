import { cn } from "@/utils/cn";
import { useIsMobile } from "@/hooks/useResponsive";
import { ReactNode } from "react";

interface FooterProps {
  children: ReactNode;
  className?: string;
}

export const Footer = ({ children, className }: FooterProps) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "flex items-end justify-center w-full min-h-[100px] p-0.5 bottom-0 flex-grow pointer-events-none",
        isMobile ? "fixed" : "absolute",
        className
      )}
      style={{ background: "linear-gradient(transparent, #172217, #172217, #172217, #172217)" }}
    >
      <div
        className={cn(
          "flex items-end justify-center w-full pointer-events-auto",
          isMobile ? "mb-5 px-2.5" : "mb-0 px-0"
        )}
      >
        {children}
      </div>
    </div>
  );
};
