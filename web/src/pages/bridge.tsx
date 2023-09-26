"use client";

import Header from "@/components/Header";
import Layout from "@/components/Layout";
import Link from "next/link";
import {
  Card,
  Container,
  VStack,
  HStack,
  Text,
  Box,
  Button,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { Arrow, Starknet, Ethereum } from "@/components/icons";

import { Web3Providers } from "@/components/Web3Providers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useConnect, useDisconnect } from "wagmi";

import { connect, disconnect, type StarknetWindowObject } from "get-starknet";
import { Contract, Provider, constants, uint256 } from "starknet";
import { formatEther } from 'viem'

import SnEthAbi from "@/abis/sn_eth.json";

const eth_snmainnet_address =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
const paper_mainnet_address = "0x7aE1D57b58fA6411F32948314BadD83583eE0e8C";

const frenlyAddress = (address: string) => {
  return (
    address.substring(0, 4) +
    "..." +
    address.substring(address.length - 4, address.length)
  );
};

export default function BridgePage() {
  const router = useRouter();

  const provider = new Provider({
    sequencer: { network: constants.NetworkName.SN_MAIN },
  });
  const snEth = new Contract(SnEthAbi, eth_snmainnet_address, provider);

  const [snWalletInfos, setSnWalletInfos] =
    useState<StarknetWindowObject>(undefined);
  const [snEthBalance, setSnEthBalance] = useState("")

  const handleConnect = async (options?: ConnectOptions) => {
    const res = await connect(options);
    setSnWalletInfos(res);

    const { balance } = await snEth.balanceOf(res?.selectedAddress);
    const frenlyBalance = Number(formatEther(uint256.uint256ToBN(balance)));
    setSnEthBalance(frenlyBalance)
  };

  const handleDisconnect = async (options?: DisconnectOptions) => {
    const res = await disconnect(options);
    setSnWalletInfos(undefined);
  };

  return (
    <Web3Providers>
      <Layout
        leftPanelProps={{
          title: "Bridge",
          prefixTitle: "$PAPER",
          imageSrc: "/images/moneysuitcase.png",
        }}
      >
        <VStack w="full" h="full" display="flex" justifyContent={"center"}>
          <Card variant="pixelated" p="6">
            <VStack boxSize="full" gap="10px" justify="center">
              <Card variant="pixelated" bg="neon.900">
                <VStack w="full" p="20px" gap="10px" justify="center">
                  <Text fontFamily="broken-console">FROM </Text>
                  <HStack
                    w="full"
                    direction={"flex"}
                    justifyContent={"space-between"}
                  >
                    <Box>
                      <Ethereum /> Mainnet
                    </Box>
                    <Box> Available </Box>
                  </HStack>
                  <Input
                    p="2"
                    bg="neon.700"
                    placeholder="0.00"
                    type="number"
                    textAlign={"right"}
                  />
                </VStack>
              </Card>

              <CustomConnectMainnet />

              <Button variant="pixelated" bg="neon.900">
                <Arrow transform={"rotate(-90deg)"} />
              </Button>

              <Card variant="pixelated" bg="neon.900">
                <VStack w="full" p="20px" gap="10px" justify="center">
                  <Text fontFamily="broken-console">TO </Text>
                  <HStack
                    w="full"
                    direction={"flex"}
                    justifyContent={"space-between"}
                  >
                    <Box>
                      <Starknet /> Starknet
                    </Box>
                    <Box> Balance </Box>
                  </HStack>
                </VStack>
              </Card>

              {!snWalletInfos && (
                <Button onClick={() => handleConnect({ modalTheme: "dark" })}>
                  Connect starknet wallet
                </Button>
              )}
              {snWalletInfos && (
                <Button
                  onClick={() => handleDisconnect({ clearLastWallet: true })}
                >
                  Disconnect {frenlyAddress(snWalletInfos.selectedAddress)} ({Number(snEthBalance).toFixed(3)} ETH)
                </Button>
              )}
            </VStack>
          </Card>

          <HStack>
            <Text fontSize="12px">
              $PAPER :{" "}
              <Link
                href={`https://etherscan.io/token/${paper_mainnet_address}`}
                target="_blank"
              >
                {paper_mainnet_address}
              </Link>
            </Text>
          </HStack>
        </VStack>
      </Layout>
    </Web3Providers>
  );
}

const CustomConnectMainnet = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted; //&& authenticationStatus !== "loading";
        const connected = ready && account && chain;
        //&& (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <Box
            // w="full"
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} w="full">
                    Connect Ethereum Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} w="full">
                    Wrong network
                  </Button>
                );
              }

              return (
                <HStack w="full">
                  <Button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {/* {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )} */}
                    {chain.name}
                  </Button>

                  <Button onClick={openAccountModal} w="full">
                    {account.displayName.replace("…", "...")}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </Button>
                </HStack>
              );
            })()}
          </Box>
        );
      }}
    </ConnectButton.Custom>
  );
};
