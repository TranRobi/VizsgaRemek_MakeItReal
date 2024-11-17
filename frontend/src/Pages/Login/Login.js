import React, { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button, IconButton, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { blue } from "@mui/material/colors";

function Login() {
	const [username, setUsername] = useState();
	const [password, setPassword] = useState();
	const [value, setValue] = useState();
	const handleValue = () => {
		setValue("");
	};
	return (
		<div className="w-full h-screen flex justify-center items-center">
			<div className="p-5 gray rounded-xl w-1/2 ">
				<div className="flex justify-between">
					<div>
						<h1 className="text-3xl font-bold beige pb-6">Login</h1>
					</div>
					<div className="w-fit mt-4">
						<a href={window.location.pathname} className=" text-red-500">
							<CancelIcon fontSize="large" />
						</a>
					</div>
				</div>
				<div className="h-fit">
					<TextField
						value={value}
						placeholder="Username/Eamil Address"
						variant="outlined"
						slotProps={{
							endAdorment: (
								<IconButton onClick={handleValue}>
									<ClearIcon />
								</IconButton>
							),
						}}
					/>
					<TextField
						value={value}
						placeholder="Password"
						variant="outlined"
						slotProps={{
							endAdorment: (
								<IconButton onClick={handleValue}>
									<ClearIcon />
								</IconButton>
							),
						}}
					/>
					<Button
						className="w-full py-3 mt-5 bg-blue-500 text-white rounded-md"
						variant="outlined"
					>
						Login
					</Button>
				</div>
			</div>
		</div>
	);
}

export default Login;
