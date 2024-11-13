import React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";

function Footer() {
  return (
    <div className="text-white gray w-full h-fit absolute left-0 bottom-0 pt-10 ">
      <div className="w-fit m-auto flex justify-between pb-10">
        <div className="text-center mr-5">
          <a
            href="https://github.com/GitHubUserName132"
            target="_blank"
            rel="noreferrer"
            className="hover:text-black transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-110 duration-300"
          >
            <GitHubIcon fontSize="large" />
          </a>
          <h3 className="hover:text-black">Mester Máté</h3>
        </div>
        <div className="text-center mr-5">
          <a
            href="https://github.com/TranRobi"
            target="_blank"
            rel="noreferrer"
            className="hover:text-black "
          >
            <GitHubIcon fontSize="large" />
            <h3 className="hover:text-black">Tran Duy Dat</h3>
          </a>
        </div>
        <div className="text-center mr-5">
          <a
            href="https://github.com/zsoltiv"
            target="_blank"
            rel="noreferrer"
            className="hover:text-black transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-110 duration-300"
          >
            <GitHubIcon fontSize="large" />
          </a>
          <h3 className="hover:text-black">Vadász Zsolt</h3>
        </div>
      </div>
      <div>
        <ul>
          <li>
            <a href="/contactus">Contact us</a>
          </li>
        </ul>
      </div>
      <div className="text-center p-3 w-full border-t-2 border-black">
        <h1>
          Copyright © 2024 MakeItReal™ | WeAreMakeItReal™. WE ARE MAKE IT REAL
          KFT. Minden jog fenntartva. All rights reserved.
        </h1>
      </div>
    </div>
  );
}

export default Footer;
