import React from "react";
import * as firebase from "firebase";
import { useHistory } from "react-router-dom";
import { Button } from "../GoalDetail/GoalDetail";

const Home = () => {
	const history = useHistory();

	firebase.auth().onAuthStateChanged(user => {
		if (firebase.auth().currentUser !== null) {
			history.push("/dashboard");
		}
	});

	const googleProvider = new firebase.auth.GoogleAuthProvider();

	return (
		<main className="w-full flex flex-col">
			<nav className="mb-3 p-5 pl-6 text-center ">
				<h1 className="text-5xl font-medium ">BucketList</h1>
				<h3 className="text-gray-2 italic tracking-wider">where dreams come true</h3>
			</nav>

			<section className="flex flex-col items-center justify-center">
				<Button
					className="flex items-center justify-center rounded bg-background-lighter px-6 py-4 text-xl"
					onClick={() => {
						firebase
							.auth()
							.signInWithRedirect(googleProvider)
							.catch(e => alert(e));
					}}
				>
					<span>Log in via Google</span>
					<svg
						className="h-8 w-8 ml-3"
						viewBox="0 0 533.5 544.3"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
							fill="#4285f4"
						/>
						<path
							d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
							fill="#34a853"
						/>
						<path
							d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
							fill="#fbbc04"
						/>
						<path
							d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
							fill="#ea4335"
						/>
					</svg>
				</Button>
			</section>
		</main>
	);
};

function Quote(
	props: React.ComponentProps<"div"> & {
		author: string;
		text: string;
	}
) {
	return (
		<div className="flex flex-col">
			<div className="text-gray-700 ">{props.text}</div>
			<div className="text-gray-500 self-end"> - {props.author}</div>
		</div>
	);
}

export default Home;
