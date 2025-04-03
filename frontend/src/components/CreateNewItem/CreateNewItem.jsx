import React, { useState, useEffect, useContext } from "react";

import { ProductsContext } from "../../context/ProductsContext";
import CancelIcon from "@mui/icons-material/Cancel";

function CreateNewItem({ open, setOpen }) {
  const [STL, setSTL] = useState();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    "stl-file": STL,
  });
  const { addProduct } = useContext(ProductsContext);
  useEffect(() => {
    formData["stl-file"] = STL;
  }, [STL]);
  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct(formData);
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
    <div className="w-1/2 h-1/2 bg-white mx-auto p-3">
      <div>
        <div className="flex justify-between">
          <h1>Add new item</h1>
          <CancelIcon
            fontSize="large"
            onClick={(e) => setOpen(!open)}
            sx={{ color: "red" }}
          />
        </div>
        <form className="flex flex-col" encType="multipart/form-data">
          <label>
            Name:
            <input
              type="text"
              name="name"
              onChange={(e) => {
                handleChange(e);
              }}
              className="w-full p-2 border-2"
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
              className="w-full p-2 border-2"
            />
          </label>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            STL file:
            <input
              class="text-black w-full border-2 p-2 bg-[#f0f0f0] cursor-pointer"
              aria-describedby="file_input_help"
              name="stl-file"
              type="file"
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
            className="w-fit p-2 bg-green-600 text-black hover:bg-green-950 hover:text-white transition duration-75"
          >
            Add new product
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateNewItem;
