import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useHistory } from "react-router-dom";
import { formatDistance } from "date-fns";
import { Button } from "../GoalDetail/GoalDetail";
import useTranslation from "Utils/useTranslation";
import csLocale from "date-fns/locale/cs";
import strings from "./strings";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Goal from "Types/Goal.type";
import { useLiveInput } from "Utils/LiveInput";
import { FormLabel, HStack, Input, InputGroup, InputLeftElement, VStack } from "@chakra-ui/react";

const Profile = () => {
	const [user] = useAuthState(firebase.auth());
	const history = useHistory();
	const [t, changeLang] = useTranslation(strings);
	const { value, onBlur, onChange } = useLiveInput(
		firebase
			.firestore()
			.collection("profiles")
			.doc(user?.uid),
		"instagram"
	);
	const [goals] = useCollectionData<Goal>(
		firebase
			.firestore()
			.collection("goals")
			.where("owner_uid", "==", user ? user?.uid : "")
	);

	const getTimeSinceRegister = (user: firebase.User) => {
		if (user.metadata.creationTime) {
			const registeredAt = new Date(user.metadata.creationTime);
			return formatDistance(
				new Date(),
				registeredAt,
				changeLang() === "cs" ? { locale: csLocale } : undefined
			);
		}
	};
	const [percentage, setPercentage] = useState(0);
	useEffect(() => {
		if (goals) {
			setPercentage(goals.filter(g => g.completed).length / goals.length);
		}
	}, [goals]);

	return (
		<div>
			<div className="flex justify-between p-5 pl-6 items-center">
				<Link to={"/dashboard"}>
					<svg fill="currentColor" className="w-8 h-8" viewBox="0 0 20 20">
						<path
							d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
							clipRule="evenodd"
							fillRule="evenodd"
						/>
					</svg>
				</Link>

				<Button
					className={"bg-gray-200 hover:bg-gray-300"}
					onClick={() => {
						firebase
							.auth()
							.signOut()
							.then(() => {
								history.push("/");
							});
					}}
				>
					{t("logOut")}{" "}
					<svg
						className="h-6 w-6 text-gray-900 ml-2"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
					</svg>
				</Button>
			</div>

			<div className="flex flex-col items-center justify-center p-5">
				{user?.photoURL ? (
					<img
						referrerPolicy="no-referrer"
						className="mb-3 w-24 h-24 rounded-full border-background-lightest border-2"
						src={user?.photoURL}
						alt="Profile"
					/>
				) : (
					<svg
						className="mb-3 h-24 w-24 text-gray-600 bg-white rounded-full mr-1 border-2 border-gray-200"
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
				<div className="text-3xl">{user?.displayName ?? user?.email}</div>
				<div className="text-gray-600">{user?.email}</div>

				<div className="text-lg mt-3 text-gray-700 w-full">
					{goals && (
						<>
							<div className="rounded bg-gray-100 p-3 mb-3 relative">
								<span
									style={{
										width: percentage * 100 + "%",
										backdropFilter: "hue-rotate(270deg) saturate(15)"
									}}
									className=" z-10 absolute top-0 left-0 rounded h-full"
								/>
								<span className="relative">
									{goals?.filter(g => g.completed).length} /{" "}
								</span>
								<span className="relative">{goals?.length} goals completed</span>
							</div>
						</>
					)}
					{user?.metadata.creationTime && (
						<>
							<div>
								{t("registeredFor")}&nbsp;
								{getTimeSinceRegister(user)}
							</div>
						</>
					)}
				</div>

				<VStack w={"full"} justifyContent={"space-between"} spacing={4}>
					<div className="flex justify-between w-full mt-4 items-center">
						<div className="text-lg ">{t("language")}</div>
						<select
							defaultValue={changeLang()}
							onChange={e => changeLang(e.target.value)}
							className="bg-gray-200 px-4 -pr-4 py-2 rounded"
						>
							<option value="cs">Česky</option>
							<option value="en">English</option>
						</select>
					</div>

					{user && (
						<HStack w={"full"} justifyContent={"space-between"}>
							<FormLabel>First name</FormLabel>
							<InputGroup w={"auto"}>
								<InputLeftElement pointerEvents="none" children={"@"} />
								<Input
									onChange={onChange}
									value={value}
									pl={8}
									onBlur={onBlur}
									placeholder="Instagram handle"
								/>
							</InputGroup>
						</HStack>
					)}
				</VStack>
			</div>
		</div>
	);
};

export default Profile;
