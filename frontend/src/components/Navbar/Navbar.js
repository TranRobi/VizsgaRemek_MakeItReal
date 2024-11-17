import { Modal } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";

import { useState } from "react";
import Login from "../../Pages/Login/Login";
import Register from "../../Pages/Register/Register";
function Navbar() {
	const [isOpened, setIsOpened] = useState(false);
	const [isOpenedRegister, setIsOpenedRegister] = useState(false);

	const handleOpen = () => {
		setIsOpened(!isOpened);
	};
	const handleOpenRegister = () => {
		setIsOpenedRegister(!isOpenedRegister);
	};
	return (
		<>
			<nav className="h-fit">
				<div className="p-2">
					<NavLink to="/">
						<img className="logo" src="logo.png" alt="logo" />
					</NavLink>
				</div>
				<div>
					<ul>
						<li>
							<NavLink to="/library">
								Library<span></span>
							</NavLink>
						</li>
						<li>
							<NavLink to="/order">
								Order<span></span>
							</NavLink>
						</li>
						<li>
							<NavLink to="/aboutus">
								About us<span></span>
							</NavLink>
						</li>
						<li>
							<a onClick={handleOpen}>
								Login<span></span>
							</a>
						</li>
						<li>
							<a onClick={handleOpenRegister}>
								Register<span></span>
							</a>
						</li>
					</ul>
				</div>
			</nav>

			<Modal open={isOpened}>
				<div>
					<Login />
				</div>
			</Modal>
			<Modal open={isOpenedRegister}>
				<div>
					<Register />
				</div>
			</Modal>
		</>
	);
}

export default Navbar;
