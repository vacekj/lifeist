import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Components/Home";

function App() {
	return (
		<div>
			<Switch>
				<Route path={"/"}>
					<Home />
				</Route>

				<Route path={"/add"}>
					<Home />
				</Route>

				<Route path={"/dashboard"}>
					<Home />
				</Route>

				<Route path={"/goal/:id"}>
					<Home />
				</Route>
			</Switch>
		</div>
	);
}

export default App;
