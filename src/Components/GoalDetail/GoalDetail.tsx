import React, { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import firebase from "firebase/app";
import Goal from "Types/Goal.type";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { motion } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import useTranslation from "Utils/useTranslation";
import strings from "./strings";
import { useFunction } from "Utils/useCloudFunction";
import { format } from "date-fns";
import { cs, enUS } from "date-fns/locale";

const GoalDetail = () => {
	const [t, lang] = useTranslation(strings);
	let { id } = useParams<{ id: string }>();
	const history = useHistory();
	const [auth] = useAuthState(firebase.auth());

	function toggleCompleteGoal() {
		goal?.ref.update({
			completed_on: firebase.firestore.Timestamp.now(),
			completed: !goalData?.completed
		} as Partial<Goal>);

		if ("vibrate" in window.navigator) {
			window.navigator.vibrate(300);
		}
	}

	function toggleArchiveGoal() {
		goal?.ref.update({
			archived: !goalData?.archived
		} as Partial<Goal>);
	}

	function togglePublicGoal() {
		goal?.ref.update({
			public: !goalData?.public
		} as Partial<Goal>);
	}

	const [goal, loading] = useDocument(
		firebase
			.firestore()
			.collection("goals")
			.doc(id)
	);

	const [goalData] = useDocumentData<Goal>(goal?.ref, {
		idField: "uid"
	});

	const goalOwner = useFunction<firebase.User>(
		"getUserByUid",
		{ uid: goalData?.owner_uid },
		goalData?.owner_uid
	);

	return (
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
				{loading && (
					<SkeletonTheme color={"#efefef"} highlightColor={"#dbdbdb"}>
						<div className="text-3xl font-medium mb-5">
							<Skeleton height={45} />
						</div>
						<div className={""}>
							<Skeleton height={80} />
						</div>
					</SkeletonTheme>
				)}

				{goalData && (
					<>
						<h1 className="text-3xl font-medium">{goalData.title}</h1>
						<p
							className={
								"text-gray-700 text-lg overflow-hidden mb-2" +
								(!goalData.description.length ? "italic text-gray-3" : "")
							}
						>
							{goalData.description}
						</p>

						<p className="text-gray-600">
							{t("setOn")}{" "}
							{format(goalData.created_at.toDate(), "do MMMM yyyy", {
								locale: lang() === "cs" ? cs : enUS
							})}
						</p>

						{goalData.completed && goalData.completed_on && (
							<p className="text-gray-600">
								{t("completedOn")}{" "}
								{format(goalData.completed_on.toDate(), "do MMMM yyyy", {
									locale: lang() === "cs" ? cs : enUS
								})}
							</p>
						)}

						{goalOwner.data && goalOwner.data.uid !== auth?.uid && (
							<div>
								<p className="mr-2">{t("setBy")}</p>
								<a href={"/profile/" + goalOwner.data.uid}>
									<UserPill
										name={goalOwner.data.displayName ?? ""}
										photoURL={goalOwner.data.photoURL ?? ""}
									/>
								</a>
							</div>
						)}

						<div className="mt-2" />

						{goalData.owner_uid === auth?.uid && (
							<div className="w-full my-3">
								<Button
									className={
										"mb-3 w-full " +
										(goalData.completed
											? "text-black border-black border-solid border"
											: "bg-green-200 hover:bg-green-300 text-green-800")
									}
									onClick={() => {
										toggleCompleteGoal();
									}}
								>
									<span className="text-xl">
										{goalData.completed ? t("uncomplete") : t("complete")}
									</span>
									{goalData.completed ? (
										<svg
											viewBox="0 0 20 20"
											fill="currentColor"
											className="x w-6 h-6"
										>
											<path
												fillRule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									) : (
										<svg
											className="w-8 h-8 ml-1"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
												fillRule="evenodd"
											/>
										</svg>
									)}
								</Button>

								<Button
									className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700"
									onClick={togglePublicGoal}
								>
									<span className="text-xl ">
										{goalData.public ? t("unpublic") : t("public")}
									</span>
									{goalData.public ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											className="w-8 h-8 ml-1"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
											/>
										</svg>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											className="w-8 h-8 ml-1"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											/>
										</svg>
									)}
								</Button>

								<div className="flex mt-3">
									<Button
										className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700"
										onClick={toggleArchiveGoal}
									>
										<span className="text-xl ">
											{goalData.archived ? t("unarchive") : t("archive")}
										</span>

										{goalData.archived ? (
											<svg
												className="w-8 h-8 ml-1"
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
												className="w-8 h-8 ml-1"
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

									<Button
										className="ml-3 w-full text-gray-600 bg-gray-200 hover:bg-gray-300"
										onClick={() => history.push("/edit/" + id)}
									>
										<span className="text-xl">{t("edit")}</span>
										<svg
											className="w-8 h-8 ml-1"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
										</svg>
									</Button>
								</div>

								<DeleteButton
									onDelete={() => {
										goal?.ref.delete().then(() => {
											history.push("/dashboard");
										});
									}}
								/>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

function DeleteButton(props: { onDelete: () => any }) {
	const [confirmShown, setConfirmShown] = useState(false);
	const [t] = useTranslation(strings);

	return (
		<Button
			className="w-full text-red-700 hover:text-red-800 mt-3"
			onClick={() => {
				if (confirmShown) {
					props.onDelete();
				} else {
					setConfirmShown(true);
				}
			}}
		>
			<span className="text-xl">{confirmShown ? t("confirm") : t("delete")}</span>
			<svg className="w-8 h-8 ml-1 text-red-700" fill="currentColor" viewBox="0 0 20 20">
				<path
					d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
					clipRule="evenodd"
					fillRule="evenodd"
				/>
			</svg>
		</Button>
	);
}

export function Button(props: React.ComponentProps<"button">) {
	return (
		<button
			{...props}
			className={
				"py-4 px-6 font-medium flex justify-center items-center rounded " +
				(props.className ?? "")
			}
		>
			{props.children}
		</button>
	);
}

export function UserPill(props: { name: string | null; photoURL: string | null }) {
	const [imgNotFound, setImgNotFound] = useState(props.photoURL === null);

	return (
		<div className="flex text-lg rounded-full pl-2 mb-2 mr-2 items-center bg-gray-200 text-gray-800">
			<span>{props.name}</span>
			{imgNotFound ? (
				<motion.img
					initial={{
						height: 0,
						width: 0
					}}
					animate={{
						height: 40,
						width: 40
					}}
					referrerPolicy="no-referrer"
					alt={(props.name ?? "User") + " avatar"}
					onError={_ => setImgNotFound(true)}
					src={props.photoURL ?? "404"}
					className="text-transparent rounded-full ml-1 border-2 border-gray-200"
				/>
			) : (
				<motion.svg
					initial={{
						height: 0,
						width: 0
					}}
					animate={{
						height: 40,
						width: 40
					}}
					className="text-gray-600 bg-white rounded-full ml-1 border-2 border-gray-200"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
						clipRule="evenodd"
						fillRule="evenodd"
					/>
				</motion.svg>
			)}
		</div>
	);
}

export default GoalDetail;
