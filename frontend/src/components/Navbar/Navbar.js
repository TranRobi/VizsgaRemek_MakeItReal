import React from "react";
function Navbar() {
  return (
    <nav>
      <div>
        <h1>logo</h1>
      </div>
      <div>
        <ul>
          <li>
            <a href="/library">
              Library<span></span>
            </a>
          </li>
          <li>
            <a href="/order">
              Orders<span></span>
            </a>
          </li>
          <li>
            <a href="https://youtube.com">
              About us<span></span>
            </a>
          </li>
          <li className="black">
            <a
              href="/login"
              className="bg-black rounded-2xl hover:bg-slate-900"
            >
              Login<span></span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
