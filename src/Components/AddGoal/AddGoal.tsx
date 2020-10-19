import React, { useRef } from "react";
import * as firebase from "firebase";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import Goal from "../../Types/Goal.type";
import useTranslation from "../../Utils/useTranslation";
import strings from "./strings";
import { AES } from "crypto-js";
import { useAuthState } from "react-firebase-hooks/auth";
import _ from "lodash";

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
				<Link className="font-medium" to={"/dashboard"}>
					{t("back")}
				</Link>
				<button className="font-medium" onClick={handleSubmit(onSubmit)}>
					{t("save")}
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
					<label className="text-gray-600 pl-1" htmlFor="title">
						{t("title")}
					</label>
					<input
						autoFocus
						name="title"
						required={true}
						minLength={1}
						maxLength={200}
						placeholder={_.sample((t("prompts") as unknown) as string[])}
						ref={register}
						className="bg-gray-100 p-2 placeholder-gray-500 w-full text-3xl text-medium mb-3 rounded h-10"
					/>
					<label className="text-gray-600 pl-1" htmlFor="description">
						{t("description")}
					</label>
					<textarea
						name="description"
						maxLength={400}
						placeholder={t("placeholderDesc")}
						ref={register}
						className="bg-gray-100 p-2 placeholder-gray-500 w-full text-xl text-medium mb-3 rounded h-40 resize-none"
					/>
				</form>
			</div>
		</div>
	);
};

export default AddGoal;
