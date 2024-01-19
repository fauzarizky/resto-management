import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Input, Select, Button, Text } from "@chakra-ui/react";
import { Navbar } from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useDebounceValue } from "../hooks/useDebounceValue";
import html2pdf from "html2pdf.js";

export const Report = () => {
  const [reports, setReports] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const debouncedSearchInput = useDebounceValue(search, 500);

  const reportCollectionRef = collection(db, "report");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = reports?.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const tableRef = useRef();
  const time = Date.now();
  const currentTime = new Date(time);
  const currentTimeUTC7 = currentTime.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });

  const handleInputItemsPerPage = (e) => {
    const num = Number(e.target.value);
    if (num === "" || num <= 0) {
      setItemsPerPage(5);
    } else {
      setItemsPerPage(e.target.value);
    }
  };

  const convertToPdf = () => {
    const pdfOptions = {
      margin: 10,
      filename: `rm-${currentTimeUTC7.slice(0, 9)}-report.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };

    html2pdf(tableRef.current, pdfOptions);
  };

  const getAllReports = async () => {
    let q = query(reportCollectionRef, orderBy(sort || "createdAt", order || "desc"));

    if (debouncedSearchInput !== "") {
      q = query(reportCollectionRef, where("name", "==", search));
    }

    const data = await getDocs(q);
    setReports(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getAllReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sort, order, debouncedSearchInput, itemsPerPage]);
  return (
    <Box>
      <Navbar />
      <Box mx={{ base: 3, md: 2 }}>
        <Box h={{base: "15vh", md: "10vh"}} display={"flex"} flexDir={{ base: "column", md: "row" }} justifyContent={"space-between"} alignItems={"center"} gap={2} my={{ base: 2, md: 0 }} >
          <Input placeholder="Search customer name" w={{ base: "100%", md: "20%" }} onChange={(e) => setSearch(e.target.value)} />
          <Box display={"flex"} gap={5} w={{ base: "100%", md: "40%" }}>
            <Select placeholder="Sort By" w={"30%"} cursor={"pointer"} onChange={(e) => setSort(e.target.value)}>
              <option value={"createdAt"}>Created At</option>
              <option value={"tableType"}>Table Type</option>
              <option value={"tableNo"}>Table Number</option>
              <option value={"numberPeople"}>Number of People</option>
            </Select>
            <Select placeholder="Order" w={"30%"} cursor={"pointer"} onChange={(e) => setOrder(e.target.value)}>
              <option value={"asc"}>A to Z</option>
              <option value={"desc"}>Z to A</option>
            </Select>
            <Input type="number" placeholder="Items Per Page" w={"30%"} onChange={handleInputItemsPerPage} />
            <Button onClick={convertToPdf} w={"30%"} colorScheme="red" display={{ base: "none", lg: "flex" }}>
              Export to PDF
            </Button>
            <Button onClick={convertToPdf} w={"30%"} colorScheme="red" display={{ base: "flex", lg: "none" }}>
              Export
            </Button>
          </Box>
        </Box>
        <TableContainer h={{ base: "60vh", md: "70vh" }} overflowY={"auto"}>
          <Table variant="striped" colorScheme="red" ref={tableRef}>
            <Thead>
              <Tr>
                <Th>Number</Th>
                <Th>Created At</Th>
                <Th>Admin Email</Th>
                <Th>Table Type</Th>
                <Th>Table Number</Th>
                <Th>Customer Name</Th>
                <Th>Number of People</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>

            {currentReports?.length !== 0 ? (
              <Tbody>
                {currentReports?.map((report) => (
                  <Tr key={report?.id}>
                    <Td>{report?.reportNumber}</Td>
                    <Td>{report?.createdAt} </Td>
                    <Td>{report?.adminEmail}</Td>
                    <Td>{report?.tableType}</Td>
                    <Td>{report?.tableNo}</Td>
                    <Td>{report?.name}</Td>
                    <Td>{report?.numberPeople}</Td>
                    <Td>{report?.description}</Td>
                  </Tr>
                ))}
              </Tbody>
            ) : (
              <Tbody>
                <Tr>
                  <Td colSpan={8} textAlign="center">
                    No Data Available
                  </Td>
                </Tr>
              </Tbody>
            )}
          </Table>
        </TableContainer>
        <Box h={"10vh"} w={"100%"} display={"flex"} justifyContent={"space-between"} alignItems={"center"} >
          <Button onClick={() => paginate(currentPage - 1)} isDisabled={currentPage === 1} colorScheme="red" color={"white"}>
            Prev
          </Button>
          <Text>{currentPage}</Text>
          <Button onClick={() => paginate(currentPage + 1)} isDisabled={indexOfLastItem >= reports?.length} colorScheme="red" color={"white"}>
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
