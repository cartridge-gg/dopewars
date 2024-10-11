import { useAccount } from "@starknet-react/core";
import { ReactNode } from "react";
import { ConnectButton } from "./ConnectButton";
import { StyleProps } from "@chakra-ui/react";

export const ChildrenOrConnect = ({ children, ...props }: { variant?: string; children: ReactNode } & StyleProps) => {
  const { isConnecting, isReconnecting, isConnected } = useAccount();
  if (isConnecting || isReconnecting) return null;
  return <>{isConnected ? children : <ConnectButton {...props} />}</>;
};
