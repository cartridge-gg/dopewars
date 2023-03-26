import { HStack, View } from ".";
import { Button } from "./Button";
import { Avatar, Connect, Disconnect } from "app/components/icons";

import { Logo } from "app/components/logo/Ryo";
import { useState } from "react";

export const Header = () => {
  const [connected, setConnected] = useState(false);
  return (
    <HStack className="align-center m-2 flex-row items-center justify-between">
      <Logo fill="#fff" />
      {connected ? (
        <HStack className="flex-row">
          <Button
            title="Shinobi"
            icon={<Avatar fill="#000" />}
            onPress={() => console.log("shinobi")}
          />
          <View className="w-2" />
          <Button
            icon={<Disconnect fill="#000" />}
            onPress={() => setConnected(false)}
          />
        </HStack>
      ) : (
        <Button
          title="Connect"
          variant="secondary"
          icon={<Connect />}
          onPress={() => setConnected(true)}
        />
      )}
    </HStack>
  );
};
