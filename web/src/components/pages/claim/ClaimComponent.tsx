import { Button } from "@/components/common";
import { useDojoContext, useRouterContext } from "@/dojo/hooks";
import { HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useAccount, useConnect } from "@starknet-react/core";
import { ConnectButton as ConnectButtonRainbow } from "@rainbow-me/rainbowkit";
import { useAccount as useEthAccount, useSignMessage as useEthSignMesage } from "wagmi";
import { parseSignature, Signature } from "viem";
import { useEffect, useMemo, useState } from "react";
import { merkle, hash, uint256 } from "starknet";
import { ChildrenOrConnect } from "@/components/wallet";
import { useToast } from "@/hooks/toast";
import { checkTxReceipt, errorMessage } from "@/dope/helpers";
import { Glock } from "@/components/icons/items";
import { HustlerIcon, Hustlers } from "@/components/hustlers";

import ownersDev from "./snapshot-dopeLoot-22075548-owners.json";
import ownersMainnet from "./snapshot-dopeLoot-22728943-owners.json";

export default function ClaimComponent() {
  const { router, isLocalhost } = useRouterContext();
  const { connectors, connect } = useConnect();

  const ethAccount = useEthAccount();
  const { signMessageAsync } = useEthSignMesage();

  const {
    chains: { selectedChain },
    clients: { toriiClient },
    contracts: { getDojoContract },
  } = useDojoContext();
  const dopeLootClaimContract = getDojoContract("dope-DopeLootClaim");

  const { account } = useAccount();

  const [manualAddress, setManualAddress] = useState("");
  const [entry, setEntry] = useState<undefined | (string | number[])[]>();
  const [manualEntry, setManualEntry] = useState<undefined | (string | number[])[]>();
  const [signature, setSignature] = useState<undefined | Signature>();
  const [proof, setProof] = useState<undefined | string[] | string[]>();

  const [isLoading, setIsLoading] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const { toast } = useToast();

  const owners = useMemo(() => {
    return selectedChain.name === "MAINNET" ? ownersMainnet : ownersDev;
  }, [selectedChain]);

  useEffect(() => {
    if (ethAccount.isConnected) {
      const res = owners.find((i) => BigInt(i[0].toString()) === BigInt(ethAccount.address?.toString() || 0));
      if (res) {
        setEntry(res);
      } else {
        setEntry(undefined);
      }
    } else {
      setEntry(undefined);
    }
  }, [ethAccount.isConnected, ethAccount.address, owners]);

  useEffect(() => {
    if (manualAddress !== "") {
      try {
        const res = owners.find((i) => BigInt(i[0].toString()) === BigInt(manualAddress.toString()));
        if (res) {
          setManualEntry(res);
        } else {
          setManualEntry(undefined);
        }
      } catch (e) {
        setManualEntry(undefined);
      }
    } else {
      setManualEntry(undefined);
    }
  }, [manualAddress]);

  useEffect(() => {
    const checkAsync = async () => {
      const entities = await toriiClient.getEventMessages({
        clause: {
          Keys: {
            keys: [ethAccount.address],
            models: ["dope-DopeLootClaimedEvent"],
            pattern_matching: "FixedLen",
          },
        },
        models: ["dope-DopeLootClaimedEvent"],
        historical: false,
        no_hashed_keys: true,
        pagination: {
          cursor: undefined,
          direction: "Forward",
          limit: 1,
          order_by: [],
        },
      });
      setHasClaimed(entities.items.length > 0);
    };

    if (ethAccount.isConnected) {
      checkAsync();
    }
  }, [ethAccount.isConnected, ethAccount.address, isLoading]);

  async function onSign(entry: (string | number[])[]) {
    const sig = await signMessageAsync({
      message: `Claim on starknet with: ${account?.address}`,
    });
    const parsedSig = parseSignature(sig);
    setSignature(parsedSig);

    setProof(buildTree(owners).getProof(getLeafHash(entry[0] as string, entry[1] as number[], entry[2] as number[])));
  }

  async function onClaim() {
    if (!account || !proof || !signature || !ethAccount || !entry) return;

    setIsLoading(true);

    try {
      // @ts-ignore
      const execution = await account?.execute([
        {
          contractAddress: dopeLootClaimContract.address,
          entrypoint: "claim",
          calldata: [
            proof.length,
            ...proof,
            ethAccount.address,
            entry[1].length,
            ...entry[1],
            entry[2].length,
            ...entry[2],
            signature.v || 0,
            uint256.bnToUint256(BigInt(signature.r)),
            uint256.bnToUint256(BigInt(signature.s)),
          ],
        },
      ]);

      let txReceipt = await account.waitForTransaction(execution.transaction_hash, {
        retryInterval: 200,
      });

      checkTxReceipt(txReceipt);

      setTimeout(() => {
        setIsLoading(false);
      }, 1_000);

      return toast({
        message: `You claimed!!`,
      });
    } catch (e: any) {
      setIsLoading(false);

      return toast({
        message: errorMessage(e?.message),
        isError: true,
      });
    }
  }

  return (
    <VStack w="full" mt={6}>
      <VStack gap={6}>
        {!ethAccount.isConnected && <div>Please connect your Ethereum wallet to check eligibility</div>}
        <ConnectButtonRainbow chainStatus={"none"} accountStatus={"address"} />
        {ethAccount.isConnected && !entry && <div>Not eligible :(</div>}
        {ethAccount.isConnected && entry && (
          <VStack maxW="800px" gap={3}>
            <>
              <Text align="center">
                {entry[0]}
                <br /> {hasClaimed ? <span>has claimed !</span> : <span>is eligible !</span>}
              </Text>
              <Text alignSelf="flex-start">
                DopeLoot <br /> {(entry[1] as number[]).join(", ")}
              </Text>
              {entry[2].length > 0 && (
                <Text alignSelf="flex-start">
                  OGs <br /> {(entry[2] as number[]).join(", ")}
                </Text>
              )}
            </>
          </VStack>
        )}

        <ChildrenOrConnect>
          {ethAccount.isConnected && account?.address && entry && !hasClaimed && (
            <VStack alignItems="center">
              {!signature && (
                <>
                  <div>Please sign your Starknet address with your Ethereum wallet</div>
                  <Button onClick={async () => await onSign(entry)}>Sign</Button>
                </>
              )}
              {/* {signature && (
              <>
                <div>signature</div>
                <div>r : {signature.r}</div>
                <div>s : {signature.s}</div>
                <div>v : {`${signature.v}`}</div>
                <div>yP: {signature.yParity}</div>
              </>
            )}
            {proof && <div>proof: {JSON.stringify(proof, null, 2)}</div>} */}
            </VStack>
          )}
        </ChildrenOrConnect>

        {signature && proof && account && !hasClaimed && (
          <Button onClick={onClaim} isLoading={isLoading}>
            Claim
          </Button>
        )}

        {!ethAccount.isConnected && (
          <VStack>
            <div> Or enter address to check </div>
            <div>(ex: 0xDEd83F74bEBe801f9560b683c21211b08b8900DE) </div>
            <Input value={manualAddress} onChange={(e) => setManualAddress(e.target.value)} />
          </VStack>
        )}

        {!ethAccount.isConnected && manualAddress && (
          <VStack>
            {manualEntry ? (
              <>
                <Text align="center" mb={3}>
                  {" "}
                  Address {manualEntry[0]} is Eligible !
                </Text>
                <div>DopeLoot owned : {(manualEntry[1] as number[]).join(", ")}</div>

                <div>OGs owned : {(manualEntry[2] as number[]).join(", ")}</div>
              </>
            ) : (
              <div>Not eligible</div>
            )}
          </VStack>
        )}

        {hasClaimed && (
          <HStack>
            <Button onClick={() => router.push("/dope")}>
              <HustlerIcon hustler={Hustlers.Dragon} mr={2} />
              My Dope
            </Button>
            <Button onClick={() => router.push("/game/Ranked?tokenIdType=1")}>
              {" "}
              <Glock /> Play
            </Button>
          </HStack>
        )}
      </VStack>
    </VStack>
  );
}

const getLeafHash = (address: string, ids: number[], og_ids: number[]) => {
  return hash.computePoseidonHashOnElements([address, ids.length, ...ids, og_ids.length, ...og_ids]);
};
const buildTree = (idsByOwner: any[]) => {
  const leafsHash = [];
  for (const leaf of idsByOwner) {
    const h = getLeafHash(leaf[0], leaf[1], leaf[2]);
    leafsHash.push(h);
  }

  const tree = new merkle.MerkleTree(leafsHash, hash.computePoseidonHash);
  return tree;
};
