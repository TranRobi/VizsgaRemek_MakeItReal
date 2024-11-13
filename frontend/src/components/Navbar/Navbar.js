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
						<a
							href="https://youtube.com"
							className="bg-black rounded-2xl hover:bg-slate-900"
						>
							Login<span></span>
						</a>
					</li>
					<li>
						<a
							href="https://youtube.com"
							className="bg-black rounded-2xl hover:bg-slate-900"
						>
							Register<span></span>
						</a>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default Navbar;
