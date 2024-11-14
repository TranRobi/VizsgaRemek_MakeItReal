import React from "react";

function Login() {
	return (
		<div className="flex justify-center h-4/5">
			<div className="">
				<h1>Login</h1>
				<form>
					<label>
						Username:
						<input type="text" name="username" />
					</label>
					<br />
					<label>
						Password:
						<input type="password" name="password" />
					</label>
					<br />
					<input type="submit" value="Submit" />
				</form>
				<p>
					Don't have an account? <a href="/register">Register</a>
				</p>
			</div>
		</div>
	);
}

export default Login;
