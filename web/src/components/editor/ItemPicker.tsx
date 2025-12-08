import { useDojoContext } from "@/dojo/hooks";
import { ParsedToken, useDojoTokens } from "@/dope/hooks";
import { useState, useMemo, useEffect } from "react";
import { AccountInterface } from "starknet";
import { Close, PaperIcon } from "../icons";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
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
  }, []);
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
        <div className="flex flex-col gap-1 items-center cursor-pointer" onClick={() => setOpen(true)}>
          {selected && (
            <>
              <img className="w-[120px] h-[120px]" src={selected.metadata?.image} />
            </>
          )}
          {!selected && (
            <div className="flex items-center justify-center bg-[#888] w-[120px] h-[120px]">
              <PaperIcon width="40px" height="40px" />
            </div>
          )}
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            {title}
          </span>
        </div>
      )}

      {variant === "List" && (
        <div className="flex flex-row gap-1 items-center cursor-pointer" onClick={() => setOpen(true)}>
          <span className="inline-flex items-center justify-center min-w-[80px] rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            {title}
          </span>
          {selected && <span>{selected.metadata.name}</span>}
          {!selected && <span className="opacity-25">None</span>}
        </div>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded bg-gray-900 p-6">
            <DialogTitle className="text-center uppercase pb-0 text-white">
              {title}
            </DialogTitle>
            <div className="mt-4">
              <Input
                className="flex mb-[10px]"
                placeholder="Filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <ul className="min-h-[420px] max-h-[420px] overflow-y-scroll w-full">
                {filteredTokens &&
                  filteredTokens.map((t) => {
                    return (
                      <li
                        className="cursor-pointer flex flex-row gap-2 items-center py-1"
                        key={t.token_id}
                        onClick={() => onSelect(t)}
                      >
                        <img className="w-[100px] h-[100px]" src={t.metadata?.image} />
                        <div className="flex flex-col">
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
                        </div>
                      </li>
                    );
                  })}
                {filteredTokens && filteredTokens.length === 0 && (
                  <li className="flex flex-row justify-center">
                    No Items!
                  </li>
                )}
              </ul>
              <div
                className={`cursor-pointer flex flex-row gap-2 items-center justify-center py-1 mt-3 ${selected ? 'opacity-100' : 'opacity-25'}`}
                onClick={() => onSelect(undefined)}
              >
                <Close /> UNEQUIP
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
