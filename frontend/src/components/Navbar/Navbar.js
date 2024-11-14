import React from "react";
function Navbar() {
	return (
		<nav className="h-fit">
			<div className="p-2">
				<a href="/">
					<img className="logo" src="logo.png" alt="logo" />
				</a>
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
							Order<span></span>
						</a>
					</li>
					<li>
						<a href="/aboutus">
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
