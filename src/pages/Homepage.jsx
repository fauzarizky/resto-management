/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Text } from "@chakra-ui/react";
import { auth, db } from "../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { UpdateTableModal } from "../components/updateTableModal";
import { Navbar } from "../components/Navbar";

export const Homepage = () => {
  const [authUser, setAuthUser] = useState(null);
  // const currentUser = auth.currentUser;
  // console.log(currentUser);
  const tablesCollectionRef = collection(db, "tableLists");
  const [tables, setTables] = useState([]);
  const [updateTableModal, setUpdateTableModal] = useState(false);
  const [selectedTableData, setSelectedTableData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const availableTable = tables.filter((table) => table.name === null);
  const totalAvailableTable = availableTable.length;
  const navigate = useNavigate();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTables = tables?.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getAllTable = async () => {
    const data = await getDocs(tablesCollectionRef);
    setTables(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleOpenUpdateModal = (data) => {
    setUpdateTableModal(!updateTableModal);
    setSelectedTableData(data);
  };

  useEffect(() => {
    getAllTable();
  }, []);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
        navigate("/");
      }
    });

    // Cleanup function
    return () => {
      listen();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <Box w={"100vw"} minH={"90vh"} display={"flex"} flexDir={"column"} justifyContent={"space-between"} alignItems={"center"} px={5}>
        <Box w={"100vw"} minH={"80vh"} display={"flex"} flexDir={"column"} justifyContent={"center"} alignItems={"center"}>
          <Box color={"white"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Text fontSize={{ base: "xl", lg: "3xl" }} fontWeight={"bold"} bgColor={"#5F0F40"} p={3} m={3} mt={5} borderRadius={"10px"}>
              {totalAvailableTable} Empty Tables
            </Text>
          </Box>
          <Box w={"60%"} h={"60%"} bgColor={"white"} borderRadius={"10px"} display={"grid"} gridTemplateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gridGap={5}>
            {currentTables.map((table) => (
              <Box
                key={table?.id}
                onClick={() => handleOpenUpdateModal(table)}
                bgColor={"#5F0F40"}
                color={"white"}
                w={"100%"}
                h={"100%"}
                borderRadius={"10px"}
                p={3}
                boxShadow={"xl"}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                cursor={"pointer"}
                _hover={{ bgColor: "#AB3A3C" }}>
                <Text fontSize={{ base: "xl", lg: "3xl" }} fontWeight={"medium"}>
                  Type: {table?.tableType} {table?.tableNo}
                </Text>
                {table?.name !== null ? (
                  <Text>
                    {table?.name?.charAt(0).toUpperCase() + table?.name?.slice(1)} {table?.numberPeople} People
                  </Text>
                ) : (
                  <Text>Empty</Text>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        <Box h={"10vh"} w={"100%"} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
          <Button onClick={() => paginate(currentPage - 1)} isDisabled={currentPage === 1} colorScheme="red" color={"white"}>
            Prev
          </Button>
          <Text>{currentPage}</Text>
          <Button onClick={() => paginate(currentPage + 1)} isDisabled={indexOfLastItem >= tables?.length} colorScheme="red" color={"white"}>
            Next
          </Button>
        </Box>
        <UpdateTableModal isOpen={updateTableModal} onClose={handleOpenUpdateModal} data={selectedTableData} updateData={getAllTable} adminEmail={authUser?.email} />
      </Box>
    </>
  );
};
