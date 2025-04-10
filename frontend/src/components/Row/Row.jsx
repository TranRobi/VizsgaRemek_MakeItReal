import React, { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function Row({ row }) {
  const [openTable, setOpenTable] = useState(false);

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
            onClick={() => setOpenTable(!openTable)}
            sx={{ color: "#fff" }}
          >
            {openTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
          {row.name}
        </TableCell>
        <TableCell sx={{ color: "#ccc" }}>{row.description}</TableCell>
      </TableRow>

      <TableRow sx={{ backgroundColor: "#121212" }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={openTable} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "#f44336", fontWeight: "bold" }}
              >
                File Details
              </Typography>
              <Table size="small">
                <TableRow>
                  <TableCell sx={{ color: "#fff" }}>File Name</TableCell>
                  <TableCell sx={{ color: "#ccc" }}>
                    {row["stl-file"]?.name || "N/A"}
                  </TableCell>
                </TableRow>
                {/* Add more details if needed */}
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default Row;
