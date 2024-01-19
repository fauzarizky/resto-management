/* eslint-disable react/prop-types */
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Text, FormControl, FormLabel, Input, Box, useToast } from "@chakra-ui/react";
import { collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase-config";

// eslint-disable-next-line react/prop-types
export const UpdateTableModal = ({ isOpen, onClose, data, updateData, adminEmail }) => {
  const toast = useToast();
  const [name, setName] = useState(null);
  const [numberPeople, setNumberPeople] = useState(null);
  const [reports, setReports] = useState([]);
  const latestReport = reports[reports.length - 1];

  const time = Date.now();
  const currentDate = new Date(time);
  const convertToUTC7 = currentDate.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });

  const reportCollectionRef = collection(db, "report");

  const getAllReports = async () => {
    const data = await getDocs(reportCollectionRef);
    setReports(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const createReport = async (description, name, numberPeople) => {
    const reportId = Date.now() + "-RM";
    const reportDocRef = doc(reportCollectionRef, reportId);
    await setDoc(reportDocRef, {
      reportNumber: latestReport?.reportNumber ? latestReport.reportNumber + 1 : 1,
      adminEmail,
      tableType: data?.tableType,
      tableNo: data?.tableNo,
      createdAt: convertToUTC7,
      name: name ? name.toLowerCase() : null,
      numberPeople: numberPeople ? Number(numberPeople) : null,
      description,
    });
  };

  const updateTableData = async (id, name, numberPeople) => {
    try {
      if (numberPeople < 1) {
        return toast({
          title: "Error",
          description: "Number of People cannot be less than 1",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      
      if (name.trim() === "") {
        return toast({
          title: "Error",
          description: "Name cannot be empty",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }

      const tableDoc = doc(db, "tableLists", id);
      const newData = {
        name,
        numberPeople: Number(numberPeople),
      };

      await createReport("Table Reserved", name, numberPeople);
      await updateDoc(tableDoc, newData);
      toast({
        title: "Success",
        description: "Table Updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setName(null);
      setNumberPeople(1);
      setTimeout(() => {
        onClose();
        updateData();
      }, 2000);
    }
  };

  const clearTableData = async (id) => {
    try {
      const tableDoc = doc(db, "tableLists", id);
      const newData = {
        name: null,
        numberPeople: null,
      };

      await createReport("Table Cleared", null, null);
      await updateDoc(tableDoc, newData);

      toast({
        title: "Success",
        description: "Table Cleared",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setTimeout(() => {
        onClose();
        updateData();
      }, 2000);
    }
  };

  useEffect(() => {
    getAllReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
      <ModalContent>
        <ModalHeader>
          {data?.tableType} {data?.tableNo}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {data?.name ? (
            <>
              <Text>Name: {data?.name}</Text>
              <Text>Number of People: {data?.numberPeople}</Text>
            </>
          ) : (
            <Box display="flex" flexDirection="column" gap={3}>
              <FormControl isRequired>
                <FormLabel>Customer Name</FormLabel>
                <Input placeholder="Input Customer Name" onChange={(e) => setName(e.target.value)} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Number of People</FormLabel>
                <Input inputMode="numeric" pattern="[1-9]*" placeholder="Input Number of People" min={1} onChange={(e) => setNumberPeople(e.target.value)} />
              </FormControl>
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
          <Button bgColor={"#5F0F40"} _hover={{ bg: "#AB3A3C" }} color={"white"} mr={3} onClick={onClose}>
            Close
          </Button>
          {data?.name ? (
            <Button onClick={() => clearTableData(data?.id)} bgColor={"#5F0F40"} _hover={{ bg: "#AB3A3C" }} color={"white"}>
              Clear The Table
            </Button>
          ) : (
            <Button onClick={() => updateTableData(data?.id, name, numberPeople)} bgColor={"#5F0F40"} _hover={{ bg: "#AB3A3C" }} color={"white"}>
              Update
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
