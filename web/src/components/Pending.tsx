import {
  HStack,
  VStack,
  Container,
  Button,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Flex,
  Spacer,
  useCounter,
  Spinner,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { Check } from "./icons";

export interface PendingProps {
  title: string;
  description: string;
  txHash: string;
}

const Pending = ({ title, description, txHash }: PendingProps) => {
  const [success, setSuccess] = useState<boolean>(false);
  return (
    <>
      <Card h="full">
        <CardHeader justifyContent="center">
          <Text>{title}</Text>
        </CardHeader>
        <CardBody pt="40px">
          <Flex
            layerStyle="card"
            bgColor="whiteAlpha.200"
            justify="center"
            align="center"
            direction="column"
            py="60px"
            gap="40px"
          >
            {success ? (
              <Check fill="white" boxSize="40px" />
            ) : (
              <Spinner
                size="lg"
                thickness="3px"
                boxSize="40px"
                emptyColor="whiteAlpha.200"
              />
            )}
            <VStack gap="12px">
              <Text textStyle="upper-bold">
                {success ? "Success!" : description}
              </Text>
              <Link as={NextLink} href="/">
                View on Starkscan
              </Link>
            </VStack>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};

export default Pending;
