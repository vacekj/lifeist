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
		<div className="flex flex-col justify-between md:max-w-4xl md:m-auto h-screen">
			<Router>
				{!auth && !loading && window.location.pathname !== "/" && <Redirect to={"/"} />}
				<Switch>
					<Route path={"/dashboard"} children={<Dashboard />} />
					<Route path={"/goal/:id"} children={<GoalDetail />} />
					<Route path={"/add"} children={<AddGoal />} />
					<Route path={"/edit/:id"} children={<EditGoal />} />
					<Route path={"/profile"} children={<Profile />} />
					<Route path={"/chat"} children={<Chat />} />
					<Route path={"/"} children={<Home />} />
				</Switch>
				<BottomNavBar />
			</Router>
		</div>
	);
}

export default App;
