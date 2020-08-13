import React, { useRef } from "react";
import * as firebase from "firebase";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import Goal from "../../Types/Goal.type";
import useTranslation from "../../Utils/useTranslation";
import strings from "./strings";
import { AES } from "crypto-js";
import { useAuthState } from "react-firebase-hooks/auth";

type AddFormData = {
	title: string;
	description: string;
};

const AddGoal = () => {
	const [t] = useTranslation(strings);
	const history = useHistory();
	const [user] = useAuthState(firebase.auth());

	const formRef = useRef<HTMLFormElement>(null);
	const { register, handleSubmit } = useForm();

	function onSubmit(data: AddFormData) {
		if (!formRef.current?.reportValidity()) {
			return;
		}
		if (!user) {
			return;
		}

		const encryptedTitle = AES.encrypt(data.title, user.uid).toString();
		const encryptedDesc = AES.encrypt(data.description, user.uid).toString();

		firebase
			.firestore()
			.collection("goals")
			.add({
				title: encryptedTitle,
				description: encryptedDesc,
				encrypted: true,
				owner_uid: firebase.auth().currentUser?.uid,
				created_at: firebase.firestore.Timestamp.now(),
				updated_at: firebase.firestore.Timestamp.now()
			} as Goal)
			.then(() => {
				history.push("/dashboard");
			})
			.catch(e => {
				console.error(e);
				/*TODO: alert user of error*/
			});
	}

	return (
		<div className="flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between p-3">
				<Link to={"/dashboard"}>
					<svg fill="currentColor" className={"w-8 h-8"} viewBox="0 0 20 20">
						<path
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clipRule="evenodd"
							fillRule="evenodd"
						/>
					</svg>
				</Link>
				<button onClick={handleSubmit(onSubmit)}>
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
			<div className="p-3">
				<h1 className="text-5xl font-bold">{t("add")}</h1>
				<form
					ref={formRef}
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col justify-center w-full"
				>
					<label className="text-gray-2" htmlFor="title">
						{t("title")}
					</label>
					<input
						autoFocus
						name="title"
						required={true}
						minLength={1}
						maxLength={200}
						placeholder={t("placeholderTitle")}
						ref={register}
						className="placeholder-gray-2 w-full text-3xl text-medium mb-3 rounded h-10"
					/>
					<label className="text-gray-2" htmlFor="description">
						{t("description")}
					</label>
					<textarea
						name="description"
						maxLength={400}
						placeholder={t("placeholderDesc")}
						ref={register}
						className="placeholder-gray-2 w-full text-xl text-medium mb-3 rounded h-40 resize-none"
					/>
				</form>
			</div>
		</div>
	);
};

export default AddGoal;
