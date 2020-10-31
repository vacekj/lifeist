import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import AddGoal from "./Components/AddGoal";
import firebase from "firebase";
import "firebase/performance";
import EditGoal from "./Components/EditGoal";
import GoalDetail from "./Components/GoalDetail";
import "./App.css";
import Profile from "./Components/Profile";
import { useAuthState } from "react-firebase-hooks/auth";
import firebaseConfig from "./firebase.config.js";
import BottomNavBar from "./Components/BottomNavBar";
import Community from "./Components/Community";

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
	if (window.location.hostname === "localhost") {
		firebase.firestore().useEmulator("localhost", 8080);
		firebase.auth().useEmulator("https://localhost:9099");
		firebase.functions().useEmulator("localhost", 5001);
	}

	const [auth, loading] = useAuthState(firebase.auth());

	return (
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
						<Route path={"/community"} children={<Community />} />
						<Route path={"/"} children={<Home />} />
					</Switch>
				</div>
				rome
				{auth?.uid && !loading && <BottomNavBar />}
			</Router>
		</div>
	);
}

export default App;
