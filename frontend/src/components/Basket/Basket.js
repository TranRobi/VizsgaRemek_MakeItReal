import React from "react";
import CloseIcon from "@mui/icons-material/Close";

function Basket({ close, basketList }) {
  return (
    <>
    <div className="bg-slate-50">
      <div className="flex justify-between items-center h-fit p-4">
        <h1 className="text-white">Shopping Basket</h1>
        <CloseIcon
          onClick={() => {
            close();
          }}
        />
      </div>
      <div className="flex flex-col items-center h-fit p-4 text-black">
        {basketList.length === 0 ? (
          <p>No items found</p>
        ) : (
          basketList.map((basket) => <p>{basket}</p>)
        )}
        <button className="w-full bg-green-500 text-white font-semibold hover:bg-green-400 transition">
          Checkout
        </button>
      </div>
    </div>
      
    </>
  );
}

export default Basket;
