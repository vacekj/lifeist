import React, { useEffect, useState } from "react";
import * as firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import Goal from "../../Types/Goal.type";

const GoalsList = () => {
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
			<Modal onClose={() => setError(null)} showing={error !== null}>
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

function Modal(
	props: React.ComponentProps<"div"> & {
		showing: boolean;
		onClose: () => any;
	}
) {
	return (
		<div
			onClick={props.showing ? props.onClose : () => {}}
			className={`${
				props.showing ? "flex" : "hidden"
			} fixed w-full h-full top-0 left-0 items-center justify-center`}
		>
			<div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50" />

			<div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
				<div className="modal-content py-4 text-left px-6">{props.children}</div>
			</div>
		</div>
	);
}

function Header() {
	return (
		<div className="flex justify-between p-3 items-center border-b border-gray-300">
			<h1 className={"text-2xl"}>My bucketlist</h1>
			<Link to={"/add"} className={"focus:outline-none focus:bg-none"}>
				<svg className={"text-blue-500 w-10 h-10"} fill="currentColor" viewBox="0 0 20 20">
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
		<Link to={"/goal/" + props.uid} className="flex flex-col p-3 border-b border-gray-300">
			<div className="text-gray-900 text-lg">{props.title}</div>
			<div className="text-gray-600">{props.description}</div>
		</Link>
	);
}

export default GoalsList;
