import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function End() {
  const router = useRouter();
  return (
    <>
      TODO: implement results page <br />
      <br /> <Button onClick={() => router.push("/")}>Restart</Button>
    </>
  );
}
