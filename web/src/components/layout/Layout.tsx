import { cn } from "@/utils/cn";
import { useIsMobile } from "@/hooks/useResponsive";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Header } from "./Header";
import { Pending } from "./Pending";

interface LayoutProps {
  customLeftPanel?: ReactNode;
  leftPanelProps?: LeftPanelProps;
  children: ReactNode;
  isSinglePanel?: boolean;
  footer?: ReactNode;
  rigthPanelMaxH?: string;
  rigthPanelScrollable?: boolean;
}

interface LeftPanelProps {
  title: string;
  prefixTitle?: string;
  imageSrc?: string;
  map?: ReactNode;
}

export const Layout = ({
  customLeftPanel,
  leftPanelProps,
  children,
  isSinglePanel = false,
  rigthPanelMaxH,
  rigthPanelScrollable = true,
  footer,
}: LayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <>
      <motion.div
        className="flex flex-col fixed w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Header />
        <div className={cn("relative container mx-auto py-4", isMobile ? "px-2.5" : "px-4")}>
          {!isSinglePanel && (!customLeftPanel ? <LeftPanel {...leftPanelProps} /> : <>{customLeftPanel}</>)}
          <RightPanel
            footer={footer}
            isSinglePanel={isSinglePanel}
            rigthPanelMaxH={rigthPanelMaxH}
            rigthPanelScrollable={rigthPanelScrollable}
            hasMap={!!leftPanelProps?.map}
          >
            {children}
          </RightPanel>
        </div>
      </motion.div>
      <Pending />
    </>
  );
};

const LeftPanel = ({ title, prefixTitle, map, imageSrc }: Partial<LeftPanelProps>) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn("flex flex-col items-center", isMobile ? "flex-none" : "flex-1 my-auto")}>
      <div className={cn("z-10 flex flex-col items-center gap-0 pointer-events-none", map ? "absolute" : "relative")}>
        <span className={cn("text-subheading text-center", isMobile ? "text-[9px]" : "text-[11px]")}>
          {prefixTitle}
        </span>
        <h1 className={cn("font-heading text-center font-normal", isMobile ? "text-[30px]" : "text-5xl")}>
          {title}
        </h1>
      </div>
      {map ? (
        <div className="flex w-full">{map}</div>
      ) : (
        <img
          src={imageSrc}
          className={cn("max-h-[60vh] h-[500px] object-contain pt-[60px]", isMobile ? "hidden" : "block")}
          alt="context"
        />
      )}
    </div>
  );
};

const RightPanel = ({
  children,
  footer,
  isSinglePanel,
  rigthPanelMaxH,
  rigthPanelScrollable,
  hasMap,
}: {
  children: ReactNode;
  footer: ReactNode;
  isSinglePanel: boolean;
  rigthPanelMaxH?: string;
  rigthPanelScrollable: boolean;
  hasMap: boolean;
}) => {
  const isMobile = useIsMobile();

  const defaultMaxH = isSinglePanel ? "calc(100dvh - 70px)" : "calc(100dvh - 145px)";
  const maxH = rigthPanelMaxH || defaultMaxH;

  return (
    <div className={cn("relative w-full flex flex-col", isMobile && hasMap ? "flex-none" : "flex-1")}>
      <div
        className={cn(
          "relative flex-1 w-full flex flex-col hide-scrollbar",
          rigthPanelScrollable ? "overflow-y-scroll" : "overflow-hidden"
        )}
        style={{ maxHeight: maxH }}
      >
        {children}
        {!isSinglePanel && rigthPanelScrollable && (
          <div className="block min-h-[80px] h-[80px] w-full" />
        )}
      </div>
      {footer}
    </div>
  );
};
