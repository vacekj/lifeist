import React from "react";
import * as firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useHistory } from "react-router-dom";
import { formatDistance } from "date-fns";
import { Button } from "../GoalDetail/GoalDetail";

const Profile = () => {
	const [user, loading, error] = useAuthState(firebase.auth());
	const history = useHistory();
	const getTimeSinceRegister = (user: firebase.User) => {
		if (user.metadata.creationTime) {
			const registeredAt = new Date(user.metadata.creationTime);
			return formatDistance(new Date(), registeredAt);
		}
	};

	return (
		<div>
			<div className="flex justify-between p-5 pl-6 items-center">
				<Link to={"/dashboard"}>
					<svg fill="currentColor" className="w-8 h-8" viewBox="0 0 20 20">
						<path
							d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
							clipRule="evenodd"
							fillRule="evenodd"
						/>
					</svg>
				</Link>

				<Button
					onClick={() => {
						firebase
							.auth()
							.signOut()
							.then(() => {
								history.push("/");
							});
					}}
				>
					Log out{" "}
					<svg
						className="h-6 w-6 text-white ml-2"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
					</svg>
				</Button>
			</div>

			<div className="flex flex-col items-center justify-center p-5">
				{user?.photoURL && (
					<img
						className="mb-3 w-24 h-24 rounded-full border-background-lightest border-2"
						src={user?.photoURL}
						alt="Profile Picture"
					/>
				)}
				<div className="text-3xl">{user?.displayName ?? user?.email}</div>
				<div className="text-gray-1">{user?.email}</div>
				<div>
					{user && !user?.emailVerified && (
						<button onClick={() => user?.sendEmailVerification()}>
							Verify your email
						</button>
					)}
				</div>
				{user?.metadata.creationTime && (
					<div className="text-lg mt-3 text-gray-2">
						Registered for{" "}
						<span className="text-white text-xl">{getTimeSinceRegister(user)}</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default Profile;
