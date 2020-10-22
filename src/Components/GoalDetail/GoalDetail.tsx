import React, { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import * as firebase from "firebase/app";
import Goal from "Types/Goal.type";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import useTranslation from "Utils/useTranslation";
import strings from "./strings";
import { useFunction, useFunctionCall } from "Utils/useCloudFunction";
import { format } from "date-fns";
import { cs, enUS } from "date-fns/locale";

interface SharedWithUser {
	email: string;
	photoURL: string;
	displayName: string;
	uid: string;
}

const GoalDetail = () => {
	const [t, lang] = useTranslation(strings);
	let { id } = useParams();
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

	const [goal, loading] = useDocument(
		firebase
			.firestore()
			.collection("goals")
			.doc(id)
	);

	const [goalData] = useDocumentData<Goal>(goal?.ref, {
		idField: "uid"
	});

	const sharedWithUserResponse = useFunction<SharedWithUser[]>(
		"getUsersByUids",
		{
			uids: goalData?.shared_with
		},
		goalData?.shared_with
	);

	const goalOwner = useFunction<firebase.User>(
		"getUserByUid",
		{ uid: goalData?.owner_uid },
		goalData?.owner_uid
	);

	function addPersonToGoal(uid: string) {
		goal?.ref.update({
			shared_with: [...(goalData?.shared_with ?? []), uid]
		} as Partial<Goal>);
	}

	const images =
		goalData &&
		goalData.memories &&
		goalData.memories[0] &&
		goalData.memories[0].photos &&
		goalData.memories[0].photos.length > 0
			? goalData.memories[0].photos
			: null;

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
							<p>
								<p className="mr-2">{t("setBy")}</p>
								<UserPill
									name={goalOwner.data.displayName ?? ""}
									photoURL={goalOwner.data.photoURL ?? ""}
								/>
							</p>
						)}

						<div className="mt-2" />

						<ShareSection
							onAdd={addPersonToGoal}
							sharedWithUsers={sharedWithUserResponse.data ?? []}
							hideAddButton={goalData.owner_uid !== auth?.uid}
						/>

						{goalData.memories && goalData.memories.length > 0 && (
							<div className="mb-8">
								<h1 className={"text-2xl font-medium"}>Memory</h1>
								<div>{goalData.memories[0].text}</div>
								<div>
									{images &&
										images.map((i, key) => (
											<img
												key={key}
												className="overflow-none max-w-1/2"
												src={i.url}
												alt={"Memory"}
											/>
										))}
								</div>
							</div>
						)}

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

								<div className="flex">
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

function ShareSection(props: {
	onAdd: (uid: string) => any;
	sharedWithUsers: SharedWithUser[];
	hideAddButton?: boolean;
}) {
	const [t] = useTranslation(strings);
	const [peoplePickerOpen, setPeoplePickerOpen] = useState(false);
	const [email, setEmail] = useState("");
	const findUser = useFunctionCall<firebase.User>("getUserByEmail");
	const [foundUser, setFoundUser] = useState<firebase.User | null>(null);
	const [loading, setLoading] = useState(false);

	async function onPickerChange(e: React.ChangeEvent<HTMLInputElement>) {
		const email = e.target.value;
		setEmail(email);

		const regex = new RegExp(
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);

		if (!regex.test(email)) {
			return;
		}

		/* Don't share with users already shared with */
		if (props.sharedWithUsers.map(user => user.email).includes(email)) {
			return;
		}
		setFoundUser(null);
		setLoading(true);
		findUser({ email }).then(user => {
			if (user.uid) {
				setFoundUser(user);
				setLoading(false);
			}
		});
	}

	return (
		<>
			{props.sharedWithUsers && (
				<>
					<div className="flex flex-col mb-5 items-start">
						<div className="flex items-center flex-wrap w-full">
							{props.sharedWithUsers.map(user => (
								<UserPill
									name={user.displayName ?? ""}
									key={user.uid}
									photoURL={user.photoURL ?? ""}
								/>
							))}

							<div className="flex items-center w-full">
								<AnimatePresence>
									{peoplePickerOpen && (
										<motion.div
											className="overflow-hidden rounded-full mr-2 pr-2 bg-gray-200"
											initial={{ width: 0 }}
											animate={{ width: "100%" }}
											exit={{ width: 0 }}
										>
											<motion.input
												className="bg-gray-200 w-full p-2 inline-flex flex-row items-center rounded outline-none"
												type="email"
												value={email}
												onChange={onPickerChange}
											/>
										</motion.div>
									)}
								</AnimatePresence>

								{!props.hideAddButton && (
									<button
										className="px-3 py-2 mt-2 text-gray-800 text-lg rounded-full mb-2 flex items-center outline-none bg-gray-200 hover:bg-gray-300"
										onClick={() => setPeoplePickerOpen(!peoplePickerOpen)}
									>
										{peoplePickerOpen ? t("cancel") : t("invite")}
										{peoplePickerOpen ? (
											<svg
												className="ml-1 h-6 w-6"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
													clipRule="evenodd"
												/>
											</svg>
										) : (
											<svg
												className="ml-1 h-6 w-6"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
											</svg>
										)}
									</button>
								)}
							</div>
						</div>

						<AnimatePresence>
							{peoplePickerOpen && loading && (
								<SkeletonTheme color={"#edf2f7"} highlightColor={"#cad3de"}>
									<motion.div
										initial={{ height: 0 }}
										animate={{ height: "auto" }}
										exit={{ height: 0 }}
										className="w-32 mb-2 rounded-full overflow-hidden"
									>
										<Skeleton height={50} />
									</motion.div>
								</SkeletonTheme>
							)}

							{peoplePickerOpen && foundUser && (
								<motion.div
									onClick={() => {
										if (foundUser) {
											props.onAdd(foundUser.uid);
											setFoundUser(null);
										}
									}}
									initial={{ height: 0 }}
									animate={{ height: "auto" }}
									exit={{ height: 0 }}
									className="cursor-pointer bg-gray-200 hover:bg-gray-300 flex justify-between items-center p-3 rounded-full
						 outline-none overflow-hidden"
								>
									<div className="flex items-center">
										{foundUser.photoURL ? (
											<img
												referrerPolicy="no-referrer"
												alt={foundUser.displayName + " profile picture"}
												src={foundUser.photoURL}
												className="inline h-6 w-6 rounded-full mr-1 border border-white"
											/>
										) : (
											<svg
												className="inline text-gray-3 w-6 h-6 rounded-full mr-1 border border-white"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
													clipRule="evenodd"
													fillRule="evenodd"
												/>
											</svg>
										)}

										<span>{foundUser.displayName}</span>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</>
			)}
		</>
	);
}

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

function UserPill(props: { name: string | null; photoURL: string | null }) {
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
