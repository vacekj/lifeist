import React, { useEffect, useRef, useState } from "react";
import * as firebase from "firebase";
import { useHistory, useParams } from "react-router-dom";
import Goal from "../../Types/Goal.type";
import { useDocument } from "react-firebase-hooks/firestore";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const AddGoal = () => {
	const { id } = useParams();
	const formRef = useRef<HTMLFormElement>(null);
	const history = useHistory();
	const [goal, loading, error] = useDocument(
		firebase
			.firestore()
			.collection("goals")
			.doc(id)
	);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	useEffect(() => {
		setTitle(goal?.data()?.title);
		setDescription(goal?.data()?.description);
	}, [loading]);

	function onSubmit() {
		if (!formRef.current?.reportValidity()) {
			return;
		}
		if (goal) {
			goal.ref
				.update({
					description,
					title,
					updated_at: firebase.firestore.Timestamp.now()
				} as Goal)
				.then(() => {
					history.push("/goal/" + id);
				})
				.catch(() => {});
		}
	}

	return (
		<div className="flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between p-3">
				<button onClick={() => history.goBack()}>
					<svg fill="currentColor" className={"w-8 h-8"} viewBox="0 0 20 20">
						<path
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clipRule="evenodd"
							fillRule="evenodd"
						/>
					</svg>
				</button>
				<h1 className="text-2xl">Edit Goal</h1>
				<button onClick={onSubmit}>
					<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clipRule="evenodd"
							fillRule="evenodd"
						/>
					</svg>
				</button>
			</div>

			{/* Form */}
			<div>
				<form ref={formRef} className="flex flex-col justify-center w-full p-3">
					<label className="text-gray-2 pl-1">Title</label>
					{loading ? (
						<SkeletonTheme color={"#232323"} highlightColor={"#444444"}>
							<div className="mb-3">
								<Skeleton height={32} />
							</div>
						</SkeletonTheme>
					) : (
						<input
							required={true}
							minLength={1}
							maxLength={200}
							value={title}
							onChange={e => setTitle(e.target.value)}
							className="bg-background-lighter placeholder-gray-2 w-full mb-3 rounded h-10 p-2 "
						/>
					)}

					<label className="text-gray-2 pl-1">Description</label>
					{loading ? (
						<SkeletonTheme color={"#232323"} highlightColor={"#444444"}>
							<div className="mb-3">
								<Skeleton height={152} />
							</div>
						</SkeletonTheme>
					) : (
						<textarea
							maxLength={400}
							value={description}
							onChange={e => setDescription(e.target.value)}
							className="bg-background-lighter placeholder-gray-2 resize-none bg-gray-200 w-full rounded h-40 p-2"
						/>
					)}
				</form>
			</div>
		</div>
	);
};

export default AddGoal;
