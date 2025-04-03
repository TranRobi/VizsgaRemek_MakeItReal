import React, { useState, useEffect } from "react";

import axios from "axios";

function CreateNewItem({ open, setOpen }) {
	const [STL, setSTL] = useState();
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		"stl-file": STL,
	});
	useEffect(() => {
		formData["stl-file"] = STL;
	}, [STL]);
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
		axios
			.post("/api/products", formData, {
				headers: { "Content-Type": "multipart/form-data" },
				Cookie: document.cookie,
			})
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
				console.log(error);
			});
	};
	const handleChange = (event) => {
		if (!event.target) {
			setFormData((values) => ({ ...values, expire_at: event.$d }));
		} else {
			setFormData((values) => ({
				...values,
				[event.target.name]: event.target.value,
			}));
		}
	};

	return (
		<div className="w-1/2 h-1/2 bg-white mx-auto ">
			<button onClick={() => setOpen(!open)} className="text-red-700">
				X
			</button>
			<h2>Add new item</h2>
			<form className="flex flex-col" encType="multipart/form-data">
				<label>
					Name:
					<input
						type="text"
						name="name"
						onChange={(e) => {
							handleChange(e);
						}}
					/>
				</label>
				<label>
					Description:
					<input
						type="text"
						name="description"
						onChange={(e) => {
							handleChange(e);
						}}
					/>
				</label>
				<label>
					<input
						type="file"
						name="stl-file"
						accept="*.stl"
						onChange={(e) => {
							setSTL(e.target.files[0]);
						}}
					/>
				</label>
				<button
					type="submit"
					onClick={(e) => {
						handleSubmit(e);
					}}
				>
					Submit
				</button>
			</form>
		</div>
	);
}

export default CreateNewItem;
