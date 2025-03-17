import React, { useContext } from "react";

import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
function ProfileNav({ setActiveTab }) {
	const { user, setUser, storedUser } = useContext(AuthContext);
	const navigate = useNavigate();
	const handleLogout = () => {
		setUser(!user);
		axios
			.post(
				"http://localhost:8080/api/logout",
				{
					LOGIN_TOKEN: storedUser,
				},
				{
					headers: { "content-type": "application/x-www-form-urlencoded" },
				}
			)
			.then((response) => {
				if (response.status === 200) {
					setUser(false);
					console.log("Sikeres kijelentkezés " + user);
				} else {
					console.log("Nem sikerült kijelentkezni: " + response.data.error);
				}
			});

		navigate("/");
	};
	return (
		<ul className="w-fit bg-neutral-900 text-white max-h-full p-2 flex flex-col justify-between">
			<div>
				<li className="mb-2">
					<a
						onClick={() => {
							setActiveTab(1);
						}}
					>
						Delivery-information
					</a>
				</li>
				<li className="mb-2">
					<a
						onClick={() => {
							setActiveTab(2);
						}}
					>
						Order history
					</a>
				</li>
				<li className="mb-2">
					<a
						onClick={() => {
							setActiveTab(3);
						}}
					>
						My models
					</a>
				</li>
				<li className="mb-2">
					<a
						onClick={() => {
							setActiveTab(4);
						}}
					>
						Statistics
					</a>
				</li>
			</div>
			<div>
				<li className="justify-end">
					<Button
						onClick={() => {
							handleLogout();
						}}
						className="p-2"
						color="error"
						variant="contained"
					>
						Log out
					</Button>
				</li>
			</div>
		</ul>
	);
}

export default ProfileNav;
