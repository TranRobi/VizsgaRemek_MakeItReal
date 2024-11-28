import React, { useState } from "react";
import { Button, createTheme, TextField, ThemeProvider } from "@mui/material";
import Stack from "@mui/material/Stack";

import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import KeyIcon from "@mui/icons-material/Key";

function Register({ close, open }) {
	const theme = createTheme({
		palette: {
			warning: {
				main: "#1C1C1C",
			},
		},
	});

	const handleOpenLogin = (e) => {
		open(e);
		close(e);
	};
	return (
		<ThemeProvider theme={theme}>
			<div className="w-full h-screen flex justify-center items-center">
				<div className="p-5 rounded-xl w-1/3 login">
					<div className="flex justify-between align-middle">
						<h1 className="text-3xl font-bold pb-6 ">Register</h1>

						<a href={window.location.pathname} className=" text-red-500">
							<CancelIcon fontSize="large" onClick={(e) => close(e)} />
						</a>
					</div>
					<form>
						<Stack spacing={2}>
							<div className="relative">
								<TextField
									id="standard-basic"
									label="Username"
									placeholder="Enter Username"
									color="warning"
									variant="standard"
									className="w-full"
								></TextField>
								<MailOutlineIcon className="absolute top-1/2 right-0" />
							</div>
							<div className="relative">
								<TextField
									id="standard-basic"
									label="Email Address"
									placeholder="Enter Email Address"
									type="text"
									color="warning"
									variant="standard"
									className="w-full"
								></TextField>
								<KeyIcon className="absolute top-1/2 right-0" />
							</div>
							<div className="relative">
								<TextField
									id="standard-basic"
									label="Password"
									placeholder="Enter password"
									type="password"
									color="warning"
									variant="standard"
									className="w-full"
								></TextField>
								<KeyIcon className="absolute top-1/2 right-0" />
							</div>
							<Button variant="contained" sx={{ py: "0.5rem" }}>
								Register
							</Button>
							<Button onClick={(e) => handleOpenLogin(e)}>Login</Button>
						</Stack>
					</form>
				</div>
			</div>
		</ThemeProvider>
	);
}

export default Register;
