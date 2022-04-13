import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import AddGoal from "./Components/AddGoal";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import "firebase/performance";
import "firebase/firestore";
import "firebase/analytics";
import EditGoal from "./Components/EditGoal";
import GoalDetail from "./Components/GoalDetail";
import "./App.css";
import Profile from "./Components/Profile";
import { useAuthState } from "react-firebase-hooks/auth";
import firebaseConfig from "./firebase.config.js";
import BottomNavBar from "./Components/BottomNavBar";
import Community from "./Components/Community";
import { ChakraProvider } from "@chakra-ui/react";
import PublicProfile from "./Components/Profile/PublicProfile";

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

	// if (window.location.hostname === "localhost") {
	// 	firebase.firestore().useEmulator("localhost", 8080);
	// 	firebase.auth().useEmulator("http://localhost:9099");
	// 	firebase.functions().useEmulator("localhost", 5001);
	// 	console.info("Using Firebase Emulators");
	// }

	const [auth, loading] = useAuthState(firebase.auth());

	return (
		<ChakraProvider>
			<div className="flex relative flex-col justify-between md:max-w-3xl md:m-auto h-screen">
				<Router>
					{!auth && !loading && window.location.pathname !== "/" && <Redirect to={"/"} />}
					<div className="pb-16">
						<Switch>
							<Route path={"/dashboard"} children={<Dashboard />} />
							<Route path={"/goal/:id"} children={<GoalDetail />} />
							<Route path={"/add"} children={<AddGoal />} />
							<Route path={"/edit/:id"} children={<EditGoal />} />
							<Route path={"/profile/:id"} children={<PublicProfile />} />
							<Route path={"/profile"} children={<Profile />} />
							<Route path={"/community"} children={<Community />} />
							<Route path={"/"} children={<Home />} />
						</Switch>
					</div>
					{auth?.uid && !loading && <BottomNavBar />}
				</Router>
			</div>
		</ChakraProvider>
	);
}

export default App;
