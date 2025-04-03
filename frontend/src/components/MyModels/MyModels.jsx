import React, { useContext, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { AuthContext } from "../../context/AuthContext";
import { ProductsContext } from "../../context/ProductsContext";
import { Button, Modal } from "@mui/material";
import CreateNewItem from "../CreateNewItem/CreateNewItem";

import Row from "../Row/Row";

function MyModels() {
  const { userID } = useContext(AuthContext);
  const { products } = useContext(ProductsContext);
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
      <div className="w-4/5 mx-auto">
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
              {products.map((prod) => {
                if (prod.uploader_id == userID) {
                  return <Row key={prod.id} row={prod} />;
                }
              })}
            </TableBody>
          </Table>
        </TableContainer>
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
