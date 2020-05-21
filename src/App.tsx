import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./Components/Home";
import GoalsList from "./Components/GoalsList";
import AddItem from "./Components/AddItem";

function App() {
	return (
		<div>
			<Router>
				<Switch>
					<Route path={"/add"}>
						<AddItem />
					</Route>
					<Route path={"/dashboard"}>
						<GoalsList />
					</Route>
					<Route path={"/goal/:id"}>
						<Home />
					</Route>
					<Route path={"/"}>
						<Home />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
