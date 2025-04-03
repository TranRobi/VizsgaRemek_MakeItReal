import React, { useContext, useState, useEffect } from "react";

import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { AuthContext } from "../../context/AuthContext";
import { Button, Modal } from "@mui/material";
import CreateNewItem from "../CreateNewItem/CreateNewItem";

function MyModels() {
	const { userID } = useContext(AuthContext);
	const [products, setProducts] = useState([]);
	const [openAddNew, setOpenAddNew] = useState(false);
	function getUserModels() {
		axios.get("/api/products").then((response) => {
			setProducts(response.data);
		});
	}

	useEffect(() => {
		getUserModels();
	}, []);

	function Row(props) {
		const { row } = props;
		const [open, setOpen] = React.useState(false);

		return (
			<React.Fragment>
				<TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
					<TableCell>
						<IconButton
							aria-label="expand row"
							size="small"
							onClick={() => setOpen(!open)}
						>
							{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					</TableCell>
					<TableCell component="th" scope="row">
						{row.name}
					</TableCell>
					<TableCell>{row.description}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
						<Collapse in={open} timeout="auto" unmountOnExit>
							<Box sx={{ margin: 1 }}>
								<Table size="small" aria-label="purchases">
									<TableHead>
										<TableRow>
											<TableCell>File name:</TableCell>
											{/**row.history.map((historyRow) => (
												<TableCell component="th" scope="row">
													{historyRow.file}
												</TableCell>
											)) */}
										</TableRow>
									</TableHead>
								</Table>
							</Box>
						</Collapse>
					</TableCell>
				</TableRow>
			</React.Fragment>
		);
	}

	Row.propTypes = {
		row: PropTypes.shape({
			calories: PropTypes.number.isRequired,
			carbs: PropTypes.number.isRequired,
			fat: PropTypes.number.isRequired,
			history: PropTypes.arrayOf(
				PropTypes.shape({
					customerId: PropTypes.string.isRequired,
					date: PropTypes.string.isRequired,
				})
			).isRequired,
			name: PropTypes.string.isRequired,
			price: PropTypes.number.isRequired,
			protein: PropTypes.number.isRequired,
		}).isRequired,
	};

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
