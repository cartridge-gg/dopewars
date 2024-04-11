import { useAccount } from "@starknet-react/core";
import { ReactNode } from "react";
import { ConnectButton } from "./ConnectButton";

export const ChildrenOrConnect = ({ children }: { children: ReactNode }) => {
  const { isConnecting, isReconnecting, isConnected } = useAccount();
  if (isConnecting || isReconnecting) return null;
  return <>{isConnected ? children : <ConnectButton />}</>;
};
