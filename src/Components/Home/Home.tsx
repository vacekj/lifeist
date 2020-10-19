import React, { useState } from "react";
import * as firebase from "firebase";
import { useHistory, useLocation } from "react-router-dom";
import { Button } from "../GoalDetail/GoalDetail";
import { useAuthState } from "react-firebase-hooks/auth";
import ScaleLoader from "react-spinners/ScaleLoader";
import quotes from "../../quotes";

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

const Home = () => {
	const history = useHistory();
	const query = useQuery();
	const showTestEmailLogin = query.get("testEmailLogin");

	const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
	const [quote] = useState(randomQuote);

	const [, loading] = useAuthState(firebase.auth());

	firebase.auth().onAuthStateChanged(user => {
		if (user) {
			history.push("/dashboard");
		}
	});

	const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
	const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();
	const appleAuthProvider = new firebase.auth.OAuthProvider("apple.com");

	return (
		<main className="w-full flex flex-col">
			<nav className="mb-3 p-5 pl-6 text-center ">
				<h1 className="text-5xl font-medium ">Lifeist</h1>
				<h3 className="italic tracking-wider">where dreams come true</h3>
			</nav>

			<section className="flex flex-col items-center justify-center">
				<Quote text={quote.text} author={quote.author ?? "unknown"} />
			</section>

			<section className="flex flex-col items-center justify-center">
				{loading ? (
					<ScaleLoader color={"#00db6a"} />
				) : (
					<>
						{/*Test Email*/}
						{showTestEmailLogin && (
							<form
								onSubmit={e => {
									e.preventDefault();
									const data = new FormData(e.currentTarget);
									firebase
										.auth()
										.signInWithEmailAndPassword(
											data.get("email") as string,
											data.get("password") as string
										)
										.then(r => console.log(r))
										.catch(r => console.error(r));
								}}
							>
								<input className="bg-black" type="text" name="email" />
								<input className="bg-black" type="password" name="password" />
								<input type={"submit"} value={"Login with test account"} />
							</form>
						)}
						{/*Google*/}
						<Button
							className="w-64 flex items-center justify-center rounded border border-grey-200 px-6 py-4 text-xl"
							onClick={() => {
								firebase
									.auth()
									.signInWithRedirect(googleAuthProvider)
									.catch(e => alert(e));
							}}
						>
							<svg
								className="h-5 w-5 mr-3"
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
							<span>Sign in via Google</span>
						</Button>

						{/*Twitter*/}
						<Button
							className="w-64 flex mt-3 items-center justify-center rounded border border-grey-200 px-6 py-4 text-xl"
							onClick={() => {
								firebase
									.auth()
									.signInWithRedirect(twitterAuthProvider)
									.catch(e => alert(e));
							}}
						>
							<svg
								className="h-5 w-5 mr-3"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 400 325"
							>
								<path fill="none" d="M-1-1h402v327H-1z" />
								<g>
									<path fill="none" d="M0-1h400v400H0z" />
									<path
										fill="#1da1f2"
										stroke="null"
										d="M125.978 324.604c150.566 0 232.92-124.743 232.92-232.92 0-3.543 0-7.07-.24-10.582A166.559 166.559 0 00399.5 38.73a163.398 163.398 0 01-47.018 12.88 82.146 82.146 0 0035.99-45.28A164.053 164.053 0 01336.49 26.2a81.939 81.939 0 00-139.506 74.66A232.41 232.41 0 0128.27 15.332 81.923 81.923 0 0053.615 124.61a81.252 81.252 0 01-37.155-10.246v1.037a81.89 81.89 0 0065.675 80.247 81.731 81.731 0 01-36.963 1.405 81.955 81.955 0 0076.48 56.85 164.26 164.26 0 01-101.665 35.111A166.638 166.638 0 01.5 287.833a231.755 231.755 0 00125.478 36.707"
									/>
								</g>
							</svg>
							<span>Log in via Twitter</span>
						</Button>

						{/*Apple*/}
						<Button
							className="w-64 flex mt-3 items-center justify-center rounded bg-black px-6 py-4 text-xl"
							onClick={() => {
								firebase
									.auth()
									.signInWithRedirect(appleAuthProvider)
									.catch(e => alert(e));
							}}
						>
							<svg
								className={"w-5 h-5 mr-3"}
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 170 170"
								version="1.1"
							>
								<path
									d="m150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929 0.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002 0.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-0.9 2.61-1.85 5.11-2.86 7.51zm-31.26-123.01c0 8.1021-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375-0.119-0.972-0.188-1.995-0.188-3.07 0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.3113 11.45-8.597 4.62-2.2516 8.99-3.4968 13.1-3.71 0.12 1.0831 0.17 2.1663 0.17 3.2409z"
									fill="#FFF"
								/>
							</svg>
							<span className="text-white">Sign in with Apple</span>
						</Button>
					</>
				)}
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
		<div className="flex flex-col w-2/3 mb-8">
			<div className="text-gray-700">{props.text}</div>
			<div className="text-gray-600 self-end mt-2"> - {props.author}</div>
		</div>
	);
}

export default Home;
