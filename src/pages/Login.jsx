import { Box, Button, FormControl, Heading, Image, Input, useToast } from "@chakra-ui/react";
import restoManagementImg from "../assets/resto-management.jpg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";

export const Login = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (email && password) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        if (userCredential) {
          toast({
            title: "Success",
            description: "Login Successful",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          navigate("/homepage");
        }
      }
    } catch (error) {
      console.error(error);
      if (error.message === "Firebase: Error (auth/invalid-credential).") {
        toast({
          title: "Error",
          description: "Invalid email or password",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  return (
    <Box w={"100vw"} h={"100vh"} display={"flex"}>
      <Box w={"50%"} h={"100%"} display={{ base: "none", lg: "flex" }}>
        <Image src={restoManagementImg} boxSize={"100%"} objectFit="cover" />
      </Box>
      <Box w={{ base: "100%", lg: "50%" }} h={"100%"} bgColor={"#E36414"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Box w={{ base: "80%", lg: "60%" }} h={"70%"} bgColor={"white"} boxShadow={"md"} borderRadius={"md"}>
          <Box w={"100%"} h={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} gap={5}>
            <Heading textAlign={"center"} fontWeight={"bold"} fontSize={"3xl"}>
              Login
            </Heading>
            <form onSubmit={handleSubmit} className="w-[100%] flex flex-col items-center gap-3">
              <FormControl isRequired w={"100%"} display={"flex"} flexDirection={"column"} alignItems={"center"} gap={3}>
                <Input type="email" placeholder="Enter your email" border={"1px solid gray"} h={"5vh"} w={"70%"} px={2} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Enter your password" border={"1px solid black"} h={"5vh"} w={"70%"} px={2} onChange={(e) => setPassword(e.target.value)} />
              </FormControl>

              <Button type="submit" bgColor={"#9A031E"} _hover={{bgColor: "#5F0F40"}} color={"white"} w={"70%"} p={2} fontSize={"lg"} borderRadius={"lg"}>
                Login
              </Button>
            </form>

            <Heading fontSize={"md"}>Dont have an account ?</Heading>
            <Button onClick={() => navigate("/register")} border={"1px solid #9A031E"} bgColor={"white"} color={"#9A031E"} w={"70%"} p={2} fontSize={"lg"} borderRadius={"lg"}>
              Register
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
