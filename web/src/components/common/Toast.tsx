import { cn } from "@/utils/cn";
import { pixelatedCardStyle } from "@/utils/borderStyles";
import { Cigarette, Close } from "../icons";
import { useIsMobile } from "@/hooks/useResponsive";

export const Toast = ({
  message,
  icon,
  onClose,
  isError,
}: {
  message: string;
  icon?: React.FC<{ size?: string }>;
  onClose: () => void;
  isError: boolean;
}) => {
  const isMobile = useIsMobile();
  const Icon = icon;

  return (
    <div
      className={cn(
        "flex items-center justify-between pointer-events-auto cursor-pointer",
        isError ? "bg-red text-neon-700" : "bg-neon-600 text-neon-400",
        isMobile ? "p-2 mt-2.5 text-sm leading-tight" : "p-4 mt-4 text-base leading-normal"
      )}
      style={pixelatedCardStyle(isError ? "#FB744A" : "#1F422A")}
      onClick={onClose}
    >
      <div className="flex items-center w-full gap-2">
        {Icon ? <Icon size="lg" /> : <Cigarette size="lg" />}
        <span>{message}</span>
      </div>
      <Close onClick={onClose} cursor="pointer" />
    </div>
  );
};
