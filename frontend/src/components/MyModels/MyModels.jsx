import React, { useContext, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Paper from "@mui/material/Paper";
import { AuthContext } from "../../context/AuthContext";
import { ProductsContext } from "../../context/ProductsContext";
import { Button, Modal } from "@mui/material";
import CreateNewItem from "../CreateNewItem/CreateNewItem";

import Row from "../Row/Row";

function MyModels() {
  const { userID } = useContext(AuthContext);
  const { products } = useContext(ProductsContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [openAddNew, setOpenAddNew] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setOpenAddNew(!openAddNew);
        }}
        variant="contained"
        color="primary"
      >
        Add new item
      </Button>
      <div className="w-4/5 mx-auto ">
        <h2 className="text-4xl text-[#EEEEEE] p-2">My Models</h2>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Name</TableCell>
                <TableCell>Desription</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products
                .map((prod) => {
                  if (prod.uploader_id == userID) {
                    return <Row key={prod.id} row={prod} />;
                  }
                })
                .slice(
                  currentPage * pageSize - pageSize,
                  currentPage * pageSize
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="flex justify-center items-center text-white">
        <IconButton
          onClick={() => {
            if (currentPage !== 1) {
              setCurrentPage(currentPage - 1);
            }
          }}
        >
          <ArrowBackIcon fontSize="large" />
        </IconButton>
        <span>
          Page {currentPage} / {Math.ceil(products.length / pageSize)}
        </span>
        <IconButton
          onClick={() => {
            if (currentPage * pageSize < products.length) {
              setCurrentPage(currentPage + 1);
            }
          }}
        >
          <ArrowForwardIcon fontSize="large" />
        </IconButton>
      </div>

      <Modal open={openAddNew}>
        <div className="flex items-center w-full h-full">
          <CreateNewItem open={openAddNew} setOpen={setOpenAddNew} />
        </div>
      </Modal>
    </>
  );
}

export default MyModels;
