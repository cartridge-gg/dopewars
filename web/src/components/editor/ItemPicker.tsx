import { useDojoContext } from "@/dojo/hooks";
import { ParsedToken, useDojoTokens } from "@/dope/hooks";
import { useState, useMemo, useEffect } from "react";
import { AccountInterface } from "starknet";
import { Close, PaperIcon } from "../icons";
import {
  Badge,
  Box,
  Flex,
  Image,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Input } from "../common";

export function ItemPicker({
  title,
  collection,
  account,
  selected,
  equipped,
  setSelected,
  itemFilter,
  variant = "Image",
}: {
  title?: string;
  collection: string;
  account?: AccountInterface;
  selected?: ParsedToken;
  equipped?: ParsedToken;
  setSelected?: (e?: ParsedToken) => void;
  itemFilter?: (e?: ParsedToken) => boolean;
  variant?: string;
}) {
  const {
    clients: { toriiClient },
    contracts: { getDojoContractManifest },
  } = useDojoContext();

  const contractManifest = getDojoContractManifest(collection);
  const addresses = useMemo(() => {
    return [contractManifest.address];
  }, [contractManifest.address]);
  const [open, setOpen] = useState(false);

  const { tokens, tokensBalances, isLoading } = useDojoTokens(toriiClient, addresses, account?.address);

  const [filteredTokens, setFilteredTokens] = useState(tokens);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    let filtered = tokens || [];

    if (itemFilter) {
      filtered = filtered.filter((t) => itemFilter(t));
    }
    // console.log(filtered)

    if (filter && filter !== "") {
      filtered = filtered.filter((t) => {
        const name = t.metadata.name?.toLowerCase() || "";
        const attributes = t.metadata.attributes?.map((i) => i.value).join(" ");
        return `${name} ${attributes}`.indexOf(filter.toLowerCase()) > -1;
      });
    }

    // filter by account address
    if (account) {
      filtered = filtered?.filter((i) => {
        return tokensBalances?.find((tb) => {
          return i.token_id === tb.token_id && tb.account_address === account?.address && tb.balance > 0;
        });
      });
    }

    if (equipped) {
      filtered.push(equipped);
    }

    setFilteredTokens(filtered);
  }, [tokens, tokensBalances, account, account?.address, equipped, selected, itemFilter, filter]);

  const onSelect = (item?: ParsedToken) => {
    setSelected && setSelected(item);
    setOpen(false);
  };

  return (
    <>
      {variant === "Image" && (
        <Flex flexDirection="column" gap={1} alignItems="center" cursor="pointer" onClick={() => setOpen(true)}>
          {selected && (
            <>
              <Image w="120px" h="120px" src={selected.metadata?.image} alt={selected.metadata?.name || "Item"} />
            </>
          )}
          {!selected && (
            <Flex
              alignItems="center"
              justifyContent="center"
              bg="#888"
              w="120px"
              h="120px"
              // className="flex items-center justify-center bg-[#888] box-content w-[140px] h-[140px]"
            >
              <PaperIcon width="40px" height="40px" />
            </Flex>
          )}
          <Badge>{title}</Badge>
        </Flex>
      )}

      {variant === "List" && (
        <Flex flexDirection="row" gap={1} alignItems="center" cursor="pointer" onClick={() => setOpen(true)}>
          <Badge minW="80px" justifyContent="center">
            {title}
          </Badge>
          {selected && <Text>{selected.metadata.name}</Text>}
          {!selected && <Text className="opacity-25">None</Text>}
        </Flex>
      )}

      <Modal motionPreset="slideInBottom" isCentered isOpen={open} onClose={() => setOpen(false)}>
        <ModalOverlay />
        <ModalContent bg="bg.dark">
          <ModalHeader textAlign="center" textTransform="uppercase" pb={0}>
            {title}
          </ModalHeader>
          <ModalBody>
            <Input
              display="flex"
              placeholder="Filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              marginBottom="10px"
            />
            <List minH="420px" maxH="420px" overflowY="scroll" w="full">
              {filteredTokens &&
                filteredTokens.map((t) => {
                  return (
                    <ListItem
                      cursor="pointer"
                      display="flex"
                      flexDirection="row"
                      gap={2}
                      alignItems="center"
                      py={1}
                      key={t.token_id}
                      onClick={() => onSelect(t)}
                    >
                      <Image w="100px" h="100px" src={t.metadata?.image} alt={t.metadata?.name || "Item"} />
                      <Flex flexDirection="column">
                        <div>
                          {t.metadata?.name} {" - "}
                          <>
                            x
                            {tokensBalances
                              ?.find((tb) => {
                                return (
                                  t.token_id === tb.token_id &&
                                  BigInt(tb.account_address) === BigInt(account?.address || 0) &&
                                  tb.balance > 0
                                );
                              })
                              ?.balance.toString()}
                          </>
                        </div>
                        <div>({t.token_id.toString()})</div>
                      </Flex>
                    </ListItem>
                  );
                })}
              {filteredTokens && filteredTokens.length === 0 && (
                <ListItem display="flex" flexDirection="row" justifyContent="center">
                  No Items!
                </ListItem>
              )}
            </List>
            <Box
              cursor="pointer"
              display="flex"
              flexDirection="row"
              gap={2}
              alignItems="center"
              justifyContent="center"
              py={1}
              mt={3}
              onClick={() => onSelect(undefined)}
              opacity={selected ? 1 : 0.25}
            >
              <Close /> UNEQUIP
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search an item" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandItem onSelect={() => onSelect(undefined)}>
            <CircleX /> Clear
          </CommandItem>
          <CommandSeparator />
          <CommandGroup heading="Suggestions">
            {isLoading && (
              <div className="w-full flex justify-center p-3">
                Loading <Loader2 className="animate-spin" />
              </div>
            )}
            {filteredTokens &&
              filteredTokens.map((t) => {
                return (
                  <CommandItem
                    key={t.token_id}
                    className="cursor-pointer"
                    onSelect={() => onSelect(t)}
                  >
                    <img
                      className="w-[100px] h-[100px]"
                      src={t.metadata?.image}
                    />
                    <div className="flex flex-col">
                      <div>
                        {t.metadata?.name} {" - "}
                        <>
                          x
                          {
                            tokensBalances?.find((tb) => {
                              return (
                                t.token_id === tb.token_id &&
                                tb.account_address === account?.address &&
                                tb.balance > 0
                              );
                            })?.balance
                          }
                        </>
                      </div>
                      <div>({t.token_id.toString()})</div>
                    </div>
                  </CommandItem>
                );
              })}
          </CommandGroup>
        </CommandList>
      </CommandDialog> */}
    </>
  );
}
