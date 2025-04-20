import React, { useContext } from "react";
import { IconButton, TableCell, TableRow } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ProductsContext } from "../../context/ProductsContext";

function Row({ row }) {
  //getting deleteProduct function from context
  const { deleteProduct } = useContext(ProductsContext);

  return (
    <>
      <TableRow
        sx={{
          backgroundColor: "#1a1a1a",
          "&:hover": { backgroundColor: "#2a2a2a" },
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              deleteProduct(row.id);
            }}
            sx={{ color: "red" }}
          >
            <DeleteIcon
              sx={{
                ":hover": {
                  scale: "1.5",
                },
              }}
            />
          </IconButton>
        </TableCell>
        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
          {row.name}
        </TableCell>
        <TableCell sx={{ color: "#ccc" }}>{row.description}</TableCell>
      </TableRow>
    </>
  );
}

export default Row;
