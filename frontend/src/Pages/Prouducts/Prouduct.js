import React, { Suspense } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import { NavLink } from "react-router-dom";

import { Canvas } from "@react-three/fiber";
import { Model } from "../../components/prodModel/Model1";
import { OrbitControls } from "@react-three/drei";
function Prouduct({ setBasketList, basketList }) {
  const params = useParams();
  function addToBasket() {}
  return (
    <>
      <Navbar basketList={basketList} />
      <div className="w-[500px] m-auto">
        <div className="h-[500px] border-2 border-black">
          <Canvas>
            <Suspense fallback={null}>
              <OrbitControls />
              <ambientLight intensity={Math.PI / 2} />
              <Model />
            </Suspense>
          </Canvas>
        </div>
        <NavLink to="/library">Go Back</NavLink>
        <button>Add to basket</button>
      </div>
      <Footer />
    </>
  );
}

export default Prouduct;
