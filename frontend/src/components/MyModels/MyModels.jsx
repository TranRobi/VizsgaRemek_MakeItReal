import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { AuthContext } from "../../context/AuthContext";
import { ProductsContext } from "../../context/ProductsContext";
import CreateNewItem from "../CreateNewItem/CreateNewItem";
import Row from "../Row/Row";

function MyModels() {
  //getting the informations from the Contexts
  const { userID } = useContext(AuthContext);
  const { products, showDelAlert } = useContext(ProductsContext);
  //declaring states
  const [currentPage, setCurrentPage] = useState(1);
  const [openAddNew, setOpenAddNew] = useState(false);
  //setting the page size
  const pageSize = 5;

  //filtering the products by user
  const filteredProducts = products.filter(
    (prod) => prod.uploader_id === parseInt(userID)
  );

  // calculating the total pages
  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  //displaying the filtered products
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      {showDelAlert ? (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          sx={{ width: "50%", margin: "auto" }}
        >
          You succesfully deleted the model.
        </Alert>
      ) : (
        <div></div>
      )}
      <Box sx={{ px: 4, py: 6, minHeight: "100vh" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" sx={{ color: "#fff", fontWeight: "bold" }}>
            My Models
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenAddNew(true)}
            sx={{
              backgroundColor: "#d32f2f",
              "&:hover": { backgroundColor: "#9a0007" },
              color: "#fff",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Add New Item
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#d32f2f" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }} />
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Description
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedProducts.map((prod) => (
                <Row key={prod.id} row={prod} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
            color: "#fff",
          }}
        >
          <IconButton
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ArrowBackIcon sx={{ color: "#fff" }} fontSize="large" />
          </IconButton>
          <Typography sx={{ mx: 2 }}>
            Page {currentPage} / {totalPages || 1}
          </Typography>
          <IconButton
            onClick={() =>
              setCurrentPage((prev) =>
                currentPage < totalPages ? prev + 1 : prev
              )
            }
            disabled={currentPage >= totalPages}
          >
            <ArrowForwardIcon sx={{ color: "#fff" }} fontSize="large" />
          </IconButton>
        </Box>

        <Modal
          open={openAddNew}
          onClose={() => setOpenAddNew(false)}
          aria-labelledby="add-new-product"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(2px)",
          }}
        >
          <CreateNewItem open={openAddNew} setOpen={setOpenAddNew} />
        </Modal>
      </Box>
    </>
  );
}

export default MyModels;
