import React from "react";
import { Link, useParams } from "react-router-dom";
import { useDocumentData } from "react-firebase-hooks/firestore";
import firebase from "firebase";

const GoalView = () => {
	let { id } = useParams();

	const [goal, loading, error] = useDocumentData<{ title: string; description: string }>(
		firebase
			.firestore()
			.collection("goals")
			.doc(id)
	);

	return !!goal && error == null ? (
		<div>
			<div className="flex items-center justify-between p-5 border-b border-gray-300">
				<Link to={"/dashboard"}>
					<svg fill="currentColor" className="w-8 h-8" viewBox="0 0 20 20">
						<path
							d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
							clipRule="evenodd"
							fillRule="evenodd"
						/>
					</svg>
				</Link>
				<h1 className="text-2xl">{goal.title}</h1>
				<button>
					<svg fill="currentColor" className="w-8 h-8" viewBox="0 0 20 20">
						<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
						<path
							d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
							clipRule="evenodd"
							fillRule="evenodd"
						/>
					</svg>
				</button>
			</div>
			<div>
				<div className="bg-gray-200 p-5 m-3">
					<p>{goal.description}</p>
				</div>
			</div>
		</div>
	) : (
		<div>loading</div>
	);
};

export default GoalView;
