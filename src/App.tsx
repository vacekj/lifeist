import React from "react";
import { Switch, Route, BrowserRouter as Router, Redirect, useHistory } from "react-router-dom";
import Home from "./Components/Home";
import firebase from "firebase";

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
	}

	return (
		<Router>
			<Switch>
				<Route path={"/add"}>
					<Home />
				</Route>

				<Route path={"/dashboard"}>
					<Home />
				</Route>

				<Route path={"/goal/:id"}>
					<Home />
				</Route>

				<Route path={"/"}>
					<Home />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
