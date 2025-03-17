import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";

import "./Profile.css";
import Footer from "../Footer/Footer";
import Delivery from "../Delivery/Delivery";
import MyOrders from "../MyOrders/MyOrders";
import MyModels from "../MyModels/MyModels";
import Statistics from "../Statistics/Statistics";
import ProfileNav from "../ProfileNav/ProfileNav";
function Profile() {
	const [activeTab, setActiveTab] = useState(1);
	const renderComponent = () => {
		switch (activeTab) {
			case 1:
				return <Delivery />;
			case 2:
				return <MyOrders />;
			case 3:
				return <MyModels />;
			case 4:
				return <Statistics />;
			default:
				return null;
		}
	};

	return (
		<>
			<Navbar />
			<div className="flex h-screen">
				<ProfileNav setActiveTab={setActiveTab} />
				<div className="h-full w-full">{renderComponent()}</div>
			</div>
			<Footer />
		</>
	);
}

export default Profile;
