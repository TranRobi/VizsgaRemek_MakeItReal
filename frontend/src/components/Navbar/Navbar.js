import { Modal } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";

import { useState } from "react";
import Login from "../../Pages/Login/Login";
import Register from "../../Pages/Register/Register";
function Navbar() {
	const [isOpened, setIsOpened] = useState(false);
	const [isOpenedRegister, setIsOpenedRegister] = useState(false);

	const closeLogin = (e) => {
		e.preventDefault();
		setIsOpened(false);
	};
	const closeRegister = (e) => {
		e.preventDefault();
		setIsOpenedRegister(false);
	};
	const openLogin = (e) => {
		e.preventDefault();
		setIsOpened(true);
	};
	const openRegister = (e) => {
		e.preventDefault();
		setIsOpenedRegister(true);
	};
	return (
		<>
			<nav className="h-fit">
				<NavLink to="/">
					<img className="logo" src="logo.png" alt="logo" />
				</NavLink>
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
							<a onClick={openLogin}>
								Login<span></span>
							</a>
						</li>
						<li>
							<a onClick={openRegister}>
								Register<span></span>
							</a>
						</li>
					</ul>
				</div>
			</nav>

			<Modal open={isOpened}>
				<div>
					<Login close={closeLogin} open={openRegister} />
				</div>
			</Modal>
			<Modal open={isOpenedRegister}>
				<div>
					<Register close={closeRegister} open={openLogin} />
				</div>
			</Modal>
		</>
	);
}

export default Navbar;
