import React, { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase";
import Goal from "Types/Goal.type";
import useTranslation from "Utils/useTranslation";
import strings from "./strings";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function UserPill(props: { name: string | null; photoURL: string | null }) {
	const [imgNotFound, setImgNotFound] = useState(props.photoURL === null);

	return (
		<div className="flex text-lg rounded-full my-2 items-center text-gray-800">
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
					className="text-transparent rounded-full mr-1 border-2 border-gray-200"
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
					className="text-gray-600 bg-white rounded-full mr-1 border-2 border-gray-200"
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
			<span>{props.name}</span>
		</div>
	);
}

export function CommItem(props: React.ComponentProps<"div"> & Goal) {
	return (
		<Link
			to={"/goal/" + props.uid}
			className={
				"text-gray-600 relative flex justify-between bg-gray-100 items-center p-5 mb-3 rounded-lg"
			}
		>
			<div>
				<div className="text-2xl font-medium">{props.title}</div>
				<div className={"text-gray-600"}>{props.description}</div>
				<UserPill name={props.owner.displayName} photoURL={props.owner.photoURL} />
			</div>
		</Link>
	);
}

const Community = () => {
	const [publicGoals] = useCollectionData<Goal>(
		firebase
			.firestore()
			.collection("goals")
			.where("public", "==", true)
	);
	const [t] = useTranslation(strings);
	return (
		<div className="flex flex-col h-full p-3">
			<h1 className={"text-5xl font-bold p-2 pl-3"}>Community</h1>
			{publicGoals && publicGoals.map(g => <CommItem {...g} />)}
		</div>
	);
};

export default Community;
