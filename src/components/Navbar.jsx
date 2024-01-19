import { signOut } from "firebase/auth";
import { Box, Heading, Stack, useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config";
import { useState } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";
export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSignOut = async () => {
    try {
      await signOut(auth);

      navigate("/");
      toast({
        title: "Success",
        description: "Logout Successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <Box w={"100vw"} h={"10vh"} bg={"#5F0F40"} color={"#FB8B24"} display={"flex"} flexDir={{ base: "column", md: "row" }} justifyContent={"space-between"} alignItems={"center"} px={2}>
        <Box display={"flex"} w={"100vw"} h={"10vh"} px={{ base: 5, md: 0 }} justifyContent={"space-between"} alignItems={"center"}>
          <Link to={"/homepage"}>
            <Heading fontWeight={"bold"} fontSize={"xl"} cursor={"pointer"} _hover={{ color: "#E36414" }}>
              Resto Management
            </Heading>
          </Link>

          <Box display={{ base: "flex", md: "none" }}>
            <HamburgerIcon onClick={() => setIsMenuOpen(!isMenuOpen)} cursor={"pointer"} />
          </Box>
        </Box>

        <Box display={{ base: "none", md: "flex" }} gap={3}>
          <Link to={"/report"}>
            <Heading fontWeight={"bold"} fontSize={"xl"} cursor={"pointer"} _hover={{ color: "#E36414" }}>
              Report
            </Heading>
          </Link>
          <Heading onClick={handleSignOut} fontWeight={"bold"} fontSize={"xl"} cursor={"pointer"} _hover={{ color: "#E36414" }}>
            Logout
          </Heading>
        </Box>
      </Box>

      {isMenuOpen && (
        <Box pb={4} display={{ md: "none" }} w={"100vw"} bg={"#5F0F40"} color={"#FB8B24"} overflowX={"hidden"}>
          <Stack as={"nav"} spacing={4} px={5}>
            <Link to={"/report"}>
              <Heading fontWeight={"bold"} fontSize={"xl"} cursor={"pointer"} _hover={{ color: "#E36414" }}>
                Report
              </Heading>
            </Link>
            <Heading onClick={handleSignOut} fontWeight={"bold"} fontSize={"xl"} cursor={"pointer"} _hover={{ color: "#E36414" }}>
              Logout
            </Heading>
          </Stack>
        </Box>
      )}
    </>
  );
};
