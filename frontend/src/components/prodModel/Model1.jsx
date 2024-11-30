import React from "react";
import { useGLTF } from "@react-three/drei";

export function Model(props) {
	const { nodes, materials } = useGLTF("/model1.glb");
	return (
		<group {...props} dispose={null} scale={0.1} position={[-3, -3, -2]}>
			<mesh geometry={nodes.Node1.geometry} material={materials["#989898FF"]} />
		</group>
	);
}

useGLTF.preload("/model1.glb");
