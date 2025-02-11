import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Profile({ close }) {
  const { user, setUser } = useContext(AuthContext);
  const handleLogout = () => {
    setUser(!user);
    localStorage.clear();
    close();
  };
  return (
    <div className="h-[80vh] w-3/4 bg-white ">
      <div className="flex justify-end">
        <button onClick={close} className="p-2">
          X
        </button>
      </div>
      <h1>Profile</h1>
      <p>This is your profile page.</p>
      <button
        onClick={() => {
          handleLogout();
        }}
        className="p-2"
      >
        Log out
      </button>
    </div>
  );
}

export default Profile;
