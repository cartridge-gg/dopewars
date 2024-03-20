import { Button } from "@/components/common";
import { useGameStore, useRouterContext } from "@/dojo/hooks";
import { headerButtonStyles } from "@/theme/styles";
import { Box, MenuItem, Text } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import { HustlerIcon, Hustlers } from "../../hustlers";


export const ProfileLink = () => {
  const { router, gameId } = useRouterContext();

  const { account } = useAccount();
  const { gameInfos } = useGameStore();

  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    if (router.pathname === "/[gameId]/logs") {
      router.back();
    } else {
      router.push(`/${gameId}/logs`);
    }
  };

  if (!account || !gameInfos) return null;

  return (
    <>
      <Button as={Box} cursor="pointer" h={["40px", "48px"]} {...headerButtonStyles} onClick={onClick}>
        <HustlerIcon hustler={gameInfos.hustler_id as Hustlers} />
      </Button>
    </>
  );
};

export const ProfileLinkMobile = () => {
  const { router, gameId } = useRouterContext();

  const { account } = useAccount();
  const { gameEvents, gameInfos } = useGameStore();

  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    if (router.pathname === "/[gameId]/logs") {
      router.back();
    } else {
      router.push(`/${gameId}/logs`);
    }
  };

  if (!account || !gameInfos || !gameEvents) return null;

  return (
    <>
      <MenuItem h="48px" borderRadius={0} onClick={onClick}>
        <HustlerIcon hustler={gameInfos.hustler_id as Hustlers} />
        <Text ml="10px">{gameEvents.playerName}</Text>
      </MenuItem>
    </>
  );
};


// export const Profile = observer(({ close, ...props }: { close?: () => void }) => {
//   const { router, gameId, playerId } = useRouterContext();

//   const { account } = useAccount();
//   const configStore = useConfigStore();
//   const gameStore = useGameStore();
//   const { game, gameInfos, gameEvents } = gameStore;

//   const { toast } = useToast();
//   const isMobile = IsMobile();

//   useEffect(() => {
//     if (gameId && playerId) {
//       // spectator
//       gameStore.init(gameId, playerId);
//     }
//   }, [gameId, playerId, gameStore]);

//   if (!game || !gameEvents || !gameInfos || !configStore) return null;

//   return (
//     <VStack w="full" {...props}>
//       <VStack w="full" maxW="380px" my="auto" pb={[0, "30px"]}>
//         <Box w="full" justifyContent="center">
//           <VStack w="full">
//             <HStack w="full" fontSize="14px">
//               <Card w="100px" alignItems="center" p={1}>
//                 <HustlerIcon hustler={gameInfos!.hustler_id as Hustlers} w="100px" h="100px" />
//               </Card>
//               <Card flex={2}>
//                 <HStack h="50px" px="10px">
//                   <User />
//                   <Heading fontFamily="dos-vga" fontWeight="normal" fontSize={"16px"}>
//                     <Text>{gameEvents.playerName}</Text>
//                   </Heading>
//                 </HStack>

//                 <Divider
//                   orientation="horizontal"
//                   w="full"
//                   borderTopWidth="1px"
//                   borderBottomWidth="1px"
//                   borderColor="neon.600"
//                 />
//                 <HStack h="50px" px="10px">
//                   <Cigarette /> <Text>{game.player.location?.name}</Text>
//                 </HStack>
//               </Card>
//             </HStack>

//             <Card w="full">
//               <HStack w="full" alignItems="center" justify="space-evenly" h="40px" fontSize="12px">
//                 <HStack flex="1" justify="center">
//                   <Text opacity={0.5}>{statName[ItemSlot.Weapon]}:</Text>
//                   <Text>{game.items.attack!.tier.stat}</Text>
//                 </HStack>

//                 <HStack flex="1" justify="center">
//                   <Text opacity={0.5}>{statName[ItemSlot.Clothes]}:</Text>
//                   <Text>{game.items.defense!.tier.stat}</Text>
//                 </HStack>

//                 <HStack flex="1" justify="center">
//                   <Text opacity={0.5}>{statName[ItemSlot.Feet]}:</Text>
//                   <Text>{game.items.speed!.tier.stat}</Text>
//                 </HStack>

//                 <HStack flex="1" justify="center">
//                   <Text opacity={0.5}>{statName[ItemSlot.Transport]}:</Text>
//                   <Text>{game.items.transport!.tier.stat / 100}</Text>
//                 </HStack>
//               </HStack>
//             </Card>

//             <HStack w="full">
//               <Tooltip label={`${game.items.attack!.upgradeName} - $${game.items.attack!.tier.cost}`}>
//                 <Card flex="1" h="40px" alignItems="center" justify="center">
//                   {game.items.attack!.icon({
//                     boxSize: "26",
//                     color: "yellow.400",
//                   })}
//                 </Card>
//               </Tooltip>
//               <Tooltip label={`${game.items.defense!.upgradeName} - $${game.items.defense!.tier.cost}`}>
//                 <Card flex="1" h="40px" alignItems="center" justify="center">
//                   {game.items.defense!.icon({
//                     boxSize: "26",
//                     color: "yellow.400",
//                   })}
//                 </Card>
//               </Tooltip>
//               <Tooltip label={`${game.items.speed!.upgradeName} - $${game.items.speed!.tier.cost}`}>
//                 <Card flex="1" h="40px" alignItems="center" justify="center">
//                   {game.items.speed!.icon({
//                     boxSize: "26",
//                     color: "yellow.400",
//                   })}
//                 </Card>
//               </Tooltip>
//               <Tooltip label={`${game.items.transport!.upgradeName} - $${game.items.transport!.tier.cost}`}>
//                 <Card flex="1" h="40px" alignItems="center" justify="center">
//                   {game.items.transport!.icon({
//                     boxSize: "26",
//                     color: "yellow.400",
//                   })}
//                 </Card>
//               </Tooltip>
//             </HStack>
//           </VStack>

//         </Box>

//         <Box w="full" justifyContent="center" py={["10px", "30px"]}>
//           <HStack w="full">
//             {close && (
//               <Button w="full" onClick={close}>
//                 Close
//               </Button>
//             )}
//             {!playerId && account && (
//               <>
//                 <Button
//                   variant="pixelated"
//                   w="full"
//                   onClick={() => {
//                     navigator.clipboard.writeText(
//                       `${window.location.origin}/${gameId}/logs?playerId=${account.address}`,
//                     );

//                     toast({
//                       message: "Copied to clipboard",
//                     });
//                   }}
//                 >
//                   Game Link
//                 </Button>
//                 <ShareButton variant="pixelated" />
//               </>
//             )}
//           </HStack>
//         </Box>
//       </VStack>
//     </VStack>
//   );
// });
