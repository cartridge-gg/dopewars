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
import { AvatarName, avatars } from "./avatar/avatars";
import colors from "@/theme/colors";
import { Score } from "@/hooks/dojo/components/useGlobalScores";

const USDFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const randomAvatar = (): AvatarName => {
  const avatarKeys = Object.keys(avatars);
  const randomAvatar = Math.floor(Math.random() * avatarKeys.length);
  return avatarKeys[randomAvatar] as AvatarName;
};

const Leaderboard = ({
  scores,
  ...props
}: { scores: Score[] } & StyleProps & ListProps) => {
  return (
    <UnorderedList
      w="full"
      variant="dotted"
      sx={{
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
      {...props}
    >
      {scores ? (
        scores?.map((score, index) => {
          const color = colors.neon["200"].toString();
          return (
            <ListItem color={color} key={index}>
              <HStack mr={3}>
                <Text w="30px" flexShrink={0} display={["none", "block"]}>
                  {index + 1}.
                </Text>
                <Box flexShrink={0} style={{ marginTop: "-8px" }}>
                  <Avatar
                    name={randomAvatar()}
                    color="green"
                    hasCrown={index === 0}
                  />
                </Box>

                <Text flexShrink={0}>{score.name}</Text>
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
                <Text flexShrink={0}>{USDFormatter.format(score.cash)}</Text>
              </HStack>
            </ListItem>
          );
        })
      ) : (
        <Text textAlign="center" color="neon.500">
          No scores submitted yet
        </Text>
      )}
    </UnorderedList>
  );
};

export default Leaderboard;
