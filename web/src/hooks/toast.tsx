import { Toast } from "@/components/common/Toast";
import { useCallback } from "react";
import toast from "react-hot-toast";

const TOAST_DURATION = 3500;

export type ToastType = ReturnType<typeof useToast>;

export const useToast = () => {
  const customToast = useCallback(
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
      toast(
        (t) => (
          <Toast
            message={message}
            icon={icon}
            onClose={() => {
              toast.dismiss(t.id);
            }}
            isError={isError}
          />
        ),
        {
          duration,
          position: "top-left",
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
            padding: 0,
            margin: 0,
          },
        },
      );
    },
    [],
  );

  return {
    toast: customToast,
  };
};
