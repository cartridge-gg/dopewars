import {
  StyleProps,
  Text,
  VStack,
  HStack,
  UnorderedList,
  Box,
  ListItem,
  ListProps,
} from "@chakra-ui/react";
import { Bag, IconProps } from "./icons";

import React, { ReactNode } from "react";
import { Avatar } from "./avatar/Avatar";
import { AvatarName , avatars} from "./avatar/avatars";
import colors from "@/theme/colors";


const USDFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});



const randomAvatar = (): AvatarName => {
  const avatarKeys = Object.keys(avatars)
  const randomAvatar = Math.floor(Math.random() * avatarKeys.length);
  return avatarKeys[randomAvatar] as AvatarName;
};

const randomCash = () => {
  return Math.floor(Math.random() * 1_000_000);
};

type LeaderboardItemType = {
  position?: number | undefined;
  avatar: AvatarName;
  name: string;
  cash: number;
  tied: boolean;
};

const leaderboardDatas: LeaderboardItemType[] = [
  {
    avatar: randomAvatar(),
    name: "ClickSave",
    cash: 1_000_000,
    tied: false,
  },
  {
    avatar: randomAvatar(),
    name: "Shinobi ⛩️",
    cash: 700_000,
    tied: false,
  },
  {
    avatar: randomAvatar(),
    name: "HPMNK",
    cash: 700_000,
    tied: false,
  },
  {
    avatar: randomAvatar(),
    name: "MrFax",
    cash: 700_000,
    tied: false,
  },
  {
    avatar: randomAvatar(),
    name: "Darkos",
    cash: 700_000,
    tied: false,
  },
  {
    avatar: randomAvatar(),
    name: "Secretive",
    cash: randomCash(),
    tied: false,
  },
  {
    avatar: randomAvatar(),
    name: "LOAF",
    cash: randomCash(),
    tied: false,
  },
  {
    avatar: randomAvatar(),
    name: "notV4l",
    cash: randomCash(),
    tied: false,
  },
  {
    avatar: randomAvatar(),
    name: "John E. Dell",
    cash: randomCash(),
    tied: false,
  },
  {
    avatar: randomAvatar(),
    name: "Johnny Dell",
    cash: randomCash(),
    tied: false,
  },
  {
    avatar: randomAvatar(),
    name: "Joe NY Dell",
    cash: randomCash(),
    tied: false,
  },
  {
    avatar: randomAvatar(),
    name: "Joey Nidell",
    cash: randomCash(),
    tied: false,
  },
  {
    avatar: randomAvatar(),
    name: "StarkPimp",
    cash: randomCash(),
    tied: false,
  },
  {
    avatar: randomAvatar(),
    name: "Anon PEPE Lover",
    cash: randomCash(),
    tied: false,
  },
  {
    avatar: randomAvatar(),
    name: "More TPS Daddy 👉👈",
    cash: randomCash(),
    tied: false,
  },
];

const sortAndCalcPosition = (
  items: LeaderboardItemType[],
): LeaderboardItemType[] => {
  const sorted = items.sort((a, b) => b.cash - a.cash);
  const withPosition = sorted.map((i, idx) => {
    const prevItem = idx > 0 ? sorted[idx - 1] : undefined;
    const nextItem = idx < sorted.length ? sorted[idx + 1] : undefined;

    i.tied = false;
    i.position = idx + 1;

    if (nextItem && i.cash === nextItem.cash) {
      i.tied = true;
      i.position = idx + 1;
    }
    if (prevItem && i.cash === prevItem?.cash) {
      i.tied = true;
      i.position = prevItem.position;
    }

    return i;
  });
  return withPosition;
};

const Leaderboard = ({ ...props }: StyleProps & ListProps) => {
  return (
    <UnorderedList w="full" variant="dotted" {...props}>
      {sortAndCalcPosition(leaderboardDatas).map((i) => {
        const isMe = i.name === "John E. Dell";
        const color = isMe
          ? colors.yellow["400"].toString()
          : colors.neon["200"].toString();
        const avatarColor = isMe ? "yellow" : "green";
        return (
          <ListItem color={color} key={`item-${i}`}>
            <HStack mr={3}>
              <Text w="30px" flexShrink={0}>
                {i.tied === true && "t"}
                {i.position}.
              </Text>
              <Box flexShrink={0} style={{ marginTop: "-8px" }}>
                <Avatar
                  name={i.avatar}
                  color={avatarColor}
                  hasCrown={i.position === 1}
                />
              </Box>

              <Text flexShrink={0}>{isMe ? `${i.name} (you)` : `${i.name}`}</Text>
              <Text
                backgroundImage={`radial-gradient(${color} 20%, transparent 20%)`}
                backgroundSize="10px 10px"
                backgroundPosition="left center"
                backgroundRepeat="repeat-x"
                flexGrow={1}
                color="transparent"
              >
                {"."}
              </Text>
              <Text flexShrink={0}>{USDFormatter.format(i.cash)}</Text>
            </HStack>
          </ListItem>
        );
      })}
    </UnorderedList>
  );
};

export default Leaderboard;
