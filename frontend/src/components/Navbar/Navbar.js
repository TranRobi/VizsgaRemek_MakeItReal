import React from "react";
import { NavLink } from "react-router-dom";
function Navbar() {
  return (
    <nav className="h-fit">
      <div className="p-2">
        <NavLink to="/">
          <img className="logo" src="logo.png" alt="logo" />
        </NavLink>
      </div>
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
          <li className="black">
            <NavLink
              to="/login"
              className="bg-black rounded-2xl hover:bg-slate-900"
            >
              Login<span></span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
