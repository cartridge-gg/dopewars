import { View as NativeView, Text as NativeText } from "react-native";
import { styled } from "nativewind";

// Helper components similar to Chakra UI
export const View = styled(NativeView);
export const Text = styled(NativeText);
export const Flex = styled(NativeView, "flex-row");
export const HStack = styled(NativeView, "flex-row");
export const VStack = styled(NativeView, "flex-col");
export const Container = styled(NativeView, "container");
export const Spacer = styled(NativeView, "flex-1");

export * from "./Button";
export * from "./Header";
