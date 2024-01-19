import { Box, Button, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import notFoundImg from "../assets/404.png";

export const Notfound = () => {
  return (
    <Box h="100vh" w={"100vw"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
      <Box w={{ base: "90%", md: "60%" }} h={{ base: "90%", md: "60%" }} display={"flex"} flexDirection={"column"} gap={5} justifyContent={"center"} alignItems={"center"}>
        <Image src={notFoundImg} alt="404" w={"75%"} />
        <Link to={"/homepage"}>
          <Button colorScheme="red" size="lg">
            Back
          </Button>
        </Link>
      </Box>
    </Box>
  );
};
