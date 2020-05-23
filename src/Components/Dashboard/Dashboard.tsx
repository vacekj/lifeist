import React, { useEffect, useState } from "react";
import * as firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import Goal from "../../Types/Goal.type";
import Modal from "../Modal";

const Dashboard = () => {
	const [error, setError] = useState<any>(null);
	const [goals, setGoals] = useState<Goal[]>([]);

	const [user, loading, authError] = useAuthState(firebase.auth());

	useEffect(() => {
		if (user) {
			updateGoals(user);
		}
	}, [loading, authError]);

	function updateGoals(user: firebase.User) {
		firebase
			.firestore()
			.collection("goals")
			.where("owner_uid", "==", user.uid)
			.get()
			.then(goals => goals.docs)
			.then(goals =>
				goals.map(g => {
					return { ...(g.data() as Goal), uid: g.id };
				})
			)
			.then(goals => setGoals(goals))
			.catch(e => {
				setError(true);
			});
	}

	return (
		<>
			<Modal
				className={error ? "border-red-600 border-2" : ""}
				onClose={() => setError(null)}
				showing={error !== null}
			>
				There was an error loading your bucketlist.
			</Modal>
			<div className={"flex flex-col"}>
				<Header />
				<div className="p-3">
					{goals.length > 0 ? (
						goals.map((g, i) => {
							return <Item key={i} {...g} />;
						})
					) : (
						<div className="flex items-center justify-center text-xl text-gray-700">
							Add a goal by tapping the Plus icon
						</div>
					)}
				</div>
			</div>
		</>
	);
};

function Header() {
	return (
		<div className="flex justify-between p-5 pl-6 items-center">
			<h1 className={"text-3xl font-medium "}>My bucketlist</h1>
			<Link to={"/add"} className={"focus:outline-none focus:bg-none"}>
				<svg
					className="text-green-primary w-10 h-10"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
						clipRule="evenodd"
						fillRule="evenodd"
					/>
				</svg>
			</Link>
		</div>
	);
}

function Item(
	props: React.ComponentProps<"div"> & {
		title: string;
		description: string;
		uid: string;
	}
) {
	return (
		<Link
			to={"/goal/" + props.uid}
			className="flex flex-col p-5 mb-3 rounded bg-background-lighter"
		>
			<div className="text-lg font-medium">{props.title}</div>
			<div className="text-gray-secondary">{props.description}</div>
		</Link>
	);
}

export default Dashboard;
