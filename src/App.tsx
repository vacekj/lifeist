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

function App() {
	const firebaseConfig = {
		apiKey: "AIzaSyDZIvG5pxmhJt5h6xyhxz_5C7_Ho7TKgQk",
		authDomain: "bucketlist-84978.firebaseapp.com",
		databaseURL: "https://bucketlist-84978.firebaseio.com",
		projectId: "bucketlist-84978",
		storageBucket: "bucketlist-84978.appspot.com",
		messagingSenderId: "538616041977",
		appId: "1:538616041977:web:e64d4a046ed175bad42d28",
		measurementId: "G-75RXHTDTMN"
	};

	if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig);
		firebase.performance();
		firebase.analytics();
	}

	const [auth, loading, error] = useAuthState(firebase.auth());

	return (
		<div className="bg-background-primary text-white md:max-w-4xl md:m-auto">
			<Router>
				{!auth && !loading && window.location.pathname != "/" && <Redirect to={"/"} />}
				<Switch>
					<Route path={"/add"} children={<AddGoal />} />
					<Route path={"/edit/:id"} children={<EditGoal />} />
					<Route path={"/dashboard"} children={<Dashboard />} />
					<Route path={"/goal/:id"} children={<GoalDetail />} />
					<Route path={"/profile"} children={<Profile />} />

					<Route path={"/"} children={<Home />} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
