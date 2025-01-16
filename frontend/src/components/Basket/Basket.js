import React from "react";
import CloseIcon from "@mui/icons-material/Close";

function Basket(props) {
	return (
		<>
			<div className="flex justify-between items-center h-fit p-4">
				<h1 className="text-white">Shopping Basket</h1>
				<CloseIcon
					onClick={() => {
						props.close();
					}}
				/>
			</div>
			<div className="flex flex-col items-center h-full p-4 text-black">
				<p>No items in the basket</p>
			</div>
		</>
	);
}

export default Basket;
