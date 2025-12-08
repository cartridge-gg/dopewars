import { cn } from "@/utils/cn";
import { ReactNode, useState, useRef, useEffect } from "react";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

export function Tooltip({
  children,
  color = "text-neon-400",
  title,
  text,
  content,
  placement = "left",
}: {
  children: ReactNode;
  color?: string;
  title?: string;
  text?: string;
  content?: ReactNode;
  placement?: TooltipPlacement;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (placement) {
        case "top":
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case "bottom":
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case "left":
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.left - tooltipRect.width - 8;
          break;
        case "right":
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.right + 8;
          break;
      }

      setPosition({ top, left });
    }
  }, [isOpen, placement]);

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onTouchStart={() => setIsOpen(true)}
        onTouchEnd={() => setIsOpen(false)}
      >
        {children}
      </span>
      {isOpen && (
        <div
          ref={tooltipRef}
          className={cn(
            "fixed z-50 bg-neon-900 border border-neon-600 rounded px-2 py-1 shadow-lg",
            color
          )}
          style={{ top: position.top, left: position.left }}
        >
          <TooltipContent title={title} content={content} text={text} color={color} />
        </div>
      )}
    </>
  );
}

const TooltipContent = ({
  title,
  text,
  content,
  color,
}: {
  title?: string;
  content?: ReactNode;
  text?: string;
  color: string;
}) => (
  <div className={cn("flex flex-col items-start w-full max-w-[260px] p-0.5 gap-0", color)}>
    {title && <span className="text-base">{title}</span>}
    {text && <span className="opacity-50">{text}</span>}
    {content ? <> {content}</> : ""}
  </div>
);
