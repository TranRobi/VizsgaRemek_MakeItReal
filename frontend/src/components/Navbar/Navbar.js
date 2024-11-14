import React from "react";
function Navbar() {
	return (
		<nav>
			<div className="p-2">
				<img className="logo" src="logo.png"/>
			</div>
			<div>
				<ul>
					<li>
						<a href="https://youtube.com">
							Webshop<span></span>
						</a>
					</li>
					<li>
						<a href="https://youtube.com">
							Contact us<span></span>
						</a>
					</li>
					<li>
						<a href="https://youtube.com">
							About us<span></span>
						</a>
					</li>
					<li className="black">
						<a href="https://youtube.com" className="">
							Login<span></span>
						</a>
					</li>
					<li>
						<a href="https://youtube.com">
							Register<span></span>
						</a>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default Navbar;
