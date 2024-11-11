import { Toast } from "@/components/common/Toast";
import { useToast as useChakraToast } from "@chakra-ui/react";
import { useCallback } from "react";

const TOAST_DURATION = 3500;

export type ToastType = ReturnType<typeof useToast>;

export const useToast = () => {
  const chakraToast = useChakraToast();

  const toast = useCallback(
    ({
      message,
      icon,
      link,
      duration = TOAST_DURATION,
      isError = false,
    }: {
      message: string;
      icon?: React.FC;
      link?: string;
      duration?: number;
      isError?: boolean;
    }) => {
      chakraToast({
        position: "top-left",
        duration,
        // default overrides
        containerStyle: {
          pointerEvents: "none",
          maxW: "100%",
          minW: "auto",
          px: "24px",
          m: 0,
        },
        isClosable: true,
        render: () => (
          <Toast
            message={message}
            icon={icon}
            // link={link}
            isError={isError}
            onClose={() => {
              // TODO: target close toast by id
              chakraToast.closeAll();
            }}
          />
        ),
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
