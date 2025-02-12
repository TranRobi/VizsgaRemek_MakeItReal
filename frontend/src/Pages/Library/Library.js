import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Card from "../../components/Cards/Card";

import { IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import axios from "axios";
function Library() {
	const [product, setProduct] = useState([]);
	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		axios
			.get("/api/products")
			.then((res) => {
				setProduct(res.data);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);
	return (
		<>
			<Navbar />
			<div>
				<div className="cards justify-center h-[90vh] ">
					{product
						.map((prod, index) => {
							return <Card key={index} prod={prod} />;
						})
						.slice(currentPage * pageSize - pageSize, currentPage * pageSize)}
				</div>
			</div>
			<div className="flex justify-center items-center">
				<IconButton
					onClick={() => {
						if (currentPage != 1) {
							setCurrentPage(currentPage - 1);
						}
					}}
				>
					<ArrowBackIcon fontSize="large" />
				</IconButton>
				<span>Page {currentPage}</span>
				<IconButton
					onClick={() => {
						if (currentPage * pageSize < product.length) {
							setCurrentPage(currentPage + 1);
						}
					}}
				>
					<ArrowForwardIcon fontSize="large" />
				</IconButton>
			</div>
			<Footer />
		</>
	);
}

export default Library;
