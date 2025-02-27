import React, { useContext, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Basket({ close, basketList, setBasketList }) {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const removeItem = (id) => {
		basketList.splice(basketList.indexOf(0, 1));
		setBasketList([...basketList]);
	};

	return (
		<>
			<div className="bg-slate-50">
				<div className="flex justify-between items-center h-fit p-4">
					<h1 className="text-black">Shopping Basket</h1>
					<CloseIcon
						onClick={() => {
							close();
						}}
						className="text-red-600"
					/>
				</div>
				<div className="flex flex-col items-center h-fit p-4 text-black">
					{basketList.length === 0 ? (
						<p>No items found</p>
					) : (
						basketList.map((basket, index) => {
							return (
								<div key={basket.id} className="flex justify-between w-3/4">
									<p>{basket.name + " x" + basket.quantity}</p>
									<button
										onClick={() => {
											removeItem(basket.id);
										}}
										className="text-red-600"
									>
										X
									</button>
								</div>
							);
						})
					)}
					<button
						className="w-full bg-green-500 text-white font-semibold hover:bg-green-400 transition"
						onClick={() => {
							if (user) {
								navigate("/payment");
							} else {
								navigate("/order");
							}
						}}
					>
						Checkout
					</button>
				</div>
			</div>
		</>
	);
}

export default Basket;
