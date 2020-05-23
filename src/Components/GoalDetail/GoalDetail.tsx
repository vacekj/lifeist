import React from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import firebase from "firebase";
import Goal from "../../Types/Goal.type";

const GoalDetail = () => {
	let { id } = useParams();
	const history = useHistory();

	function toggleCompleteGoal() {
		goal?.ref.update({
			completed_on: firebase.firestore.Timestamp.now(),
			completed: !goalData?.completed
		} as Partial<Goal>);
	}

	function toggleArchiveGoal() {
		goal?.ref.update({
			archived: !goalData?.archived
		} as Partial<Goal>);
	}

	const [goal, loading, error] = useDocument(
		firebase
			.firestore()
			.collection("goals")
			.doc(id)
	);

	const [goalData, dataLoading, dataError] = useDocumentData<Goal>(
		firebase
			.firestore()
			.collection("goals")
			.doc(id)
	);

	return !!goalData && error == null ? (
		<div>
			<div className="flex items-center justify-between p-5">
				<Link to={"/dashboard"}>
					<svg fill="currentColor" className="w-8 h-8" viewBox="0 0 20 20">
						<path
							d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
							clipRule="evenodd"
							fillRule="evenodd"
						/>
					</svg>
				</Link>
			</div>
			<div className="p-5">
				<h1 className="text-3xl font-medium">{goalData.title}</h1>
				<p
					className={
						"text-gray-2 text-lg " +
						(!goalData.description.length ? "italic text-gray-3" : "")
					}
				>
					{goalData.description.length ? goalData.description : "No description"}
				</p>
				<div className="w-full my-3">
					<Button
						className={
							"mb-3 " +
							(goalData.completed
								? "bg-green-1 hover:bg-green-1 text-black"
								: "text-green-1")
						}
						onClick={toggleCompleteGoal}
					>
						<span className="text-xl">
							{goalData.completed ? "Undo Mark as Completed" : "Mark as Completed"}
						</span>
						{goalData.completed ? (
							<svg
								className="w-8 h-8 ml-1"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
							</svg>
						) : (
							<svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
									fillRule="evenodd"
								/>
							</svg>
						)}
					</Button>

					<div className="flex">
						<Button className="" onClick={toggleArchiveGoal}>
							<span className="text-xl text-gray-2">
								{goalData.archived ? "Unarchive" : "Archive"}
							</span>
							{goalData.archived ? (
								<svg
									className="w-8 h-8 text-gray-2"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
								</svg>
							) : (
								<svg
									fill="currentColor"
									viewBox="0 0 20 20"
									className="w-8 h-8 text-gray-2"
								>
									<path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
									<path
										d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
										clipRule="evenodd"
										fillRule="evenodd"
									/>
								</svg>
							)}
						</Button>
						<Button className="ml-3" onClick={() => history.push("/edit/" + id)}>
							<span className="text-xl text-gray-100">Edit</span>
							<svg
								className="w-8 h-8 ml-1 text-gray-100"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
							</svg>
						</Button>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div>loading</div>
	);
};

function Button(props: React.ComponentProps<"button">) {
	return (
		<button
			{...props}
			className={
				"py-6 font-medium w-full flex justify-center items-center rounded bg-background-lighter hover:bg-background-lightest " +
				(props.className ?? "")
			}
		>
			{props.children}
		</button>
	);
}

export default GoalDetail;
