import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import AddGoal from "./Components/AddGoal";
import * as firebase from "firebase";
import "firebase/performance";
import EditGoal from "./Components/EditGoal";
import GoalDetail from "./Components/GoalDetail";
import "./App.css";
import Profile from "./Components/Profile";
import { useAuthState } from "react-firebase-hooks/auth";
import firebaseConfig from "./firebase.config.js";
import BottomNavBar from "./Components/BottomNavBar";
import Chat from "./Components/Chat";

declare global {
	interface Window {
		langCode: string;
	}
}
function App() {
	if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig);
		firebase.performance();
		firebase.analytics();
	}

	const [auth, loading] = useAuthState(firebase.auth());

	return (
		/*TODO: bottom bar and main section fixed height and scrolling on main section*/
		<div className="flex relative flex-col justify-between md:max-w-3xl md:m-auto h-screen">
			<Router>
				{!auth && !loading && window.location.pathname !== "/" && <Redirect to={"/"} />}
				<div className="pb-16">
					<Switch>
						<Route path={"/dashboard"} children={<Dashboard />} />
						<Route path={"/goal/:id"} children={<GoalDetail />} />
						<Route path={"/add"} children={<AddGoal />} />
						<Route path={"/edit/:id"} children={<EditGoal />} />
						<Route path={"/profile"} children={<Profile />} />
						<Route path={"/chat"} children={<Chat />} />
						<Route path={"/"} children={<Home />} />
					</Switch>
				</div>
				<BottomNavBar />
			</Router>
		</div>
	);
}

export default App;
