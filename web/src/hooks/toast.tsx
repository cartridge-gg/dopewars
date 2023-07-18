import { useToast as useChakraToast } from "@chakra-ui/react";
import { useCallback } from "react";
import { Toast } from "@/components/Toast";

const TOAST_DURATION = 5000;

export const useToast = () => {
  const chakraToast = useChakraToast();

  const toast = useCallback(
    (message: string, icon?: React.FC, link?: string) => {
      chakraToast({
        position: "bottom-left",
        duration: TOAST_DURATION,
        // default overrides
        containerStyle: {
          maxW: ["100vw", "400px"],
          minW: ["100vw", "400px"],
          px: "24px",
          m: 0,
        },
        render: () => <Toast message={message} icon={icon} link={link} />,
      });
    },
    [chakraToast],
  );

  const clear = useCallback(() => {
    chakraToast.closeAll();
  }, [chakraToast]);

  return {
    toast,
    clear,
  };
};
