import React, { useEffect, useRef, useState } from "react";
import * as firebase from "firebase";
import { useHistory, useParams } from "react-router-dom";
import Goal from "Types/Goal.type";
import { useDocument } from "react-firebase-hooks/firestore";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import useTranslation from "Utils/useTranslation";
import strings from "./strings";

const AddGoal = () => {
	const [t] = useTranslation(strings);
	const { id } = useParams();
	const formRef = useRef<HTMLFormElement>(null);
	const history = useHistory();
	const [goal, loading] = useDocument(
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
	}, [loading, goal]);

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
				<button className="font-medium" onClick={() => history.goBack()}>
					{t("back")}
				</button>
				<h1 className="text-2xl">{t("edit")}</h1>
				<button className="font-medium" onClick={onSubmit}>
					{t("save")}
				</button>
			</div>

			{/* Form */}
			<div>
				<form ref={formRef} className="flex flex-col justify-center w-full p-3">
					<label className="text-gray-600 pl-1">{t("title")}</label>
					{loading ? (
						<SkeletonTheme color={"#f5f5f5"} highlightColor={"#e0e0e0"}>
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
							className="placeholder-gray-2 bg-gray-100 w-full mb-3 rounded h-10 p-2 "
						/>
					)}

					<label className="text-gray-600 pl-1">{t("description")}</label>
					{loading ? (
						<SkeletonTheme color={"#f5f5f5"} highlightColor={"#e0e0e0"}>
							<div className="mb-3">
								<Skeleton height={152} />
							</div>
						</SkeletonTheme>
					) : (
						<textarea
							maxLength={400}
							value={description}
							onChange={e => setDescription(e.target.value)}
							className="placeholder-gray-2 bg-gray-100 resize-none w-full rounded h-40 p-2"
						/>
					)}
				</form>
			</div>
		</div>
	);
};

export default AddGoal;
