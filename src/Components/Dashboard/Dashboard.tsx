import React, { useState } from "react";
import * as firebase from "firebase";
import { User } from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import Goal from "../../Types/Goal.type";
import Modal from "../Modal";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useCollectionData } from "react-firebase-hooks/firestore";
import useTranslation from "../../Utils/useTranslation";
import strings from "./strings";
import Completed from "../../Illustrations/Completed";
import { motion } from "framer-motion";

const Dashboard = () => {
	const [error, setError] = useState<any>(null);
	const [t] = useTranslation(strings);

	const [user, loading] = useAuthState(firebase.auth());
	const [goals] = useCollectionData<Goal>(
		firebase
			.firestore()
			.collection("goals")
			.orderBy("created_at", "desc")
			.where("owner_uid", "==", user?.uid ?? ""),
		{ idField: "uid" }
	);

	return (
		<>
			<Modal
				className={error ? "border-red-600 border-2" : ""}
				onClose={() => setError(null)}
				showing={error !== null}
			>
				{t("error")}
			</Modal>
			<div className={"flex flex-col h-full"}>
				<Header />

				<div className="p-3 h-full">
					{/*Loading */}
					{loading &&
						Array(5)
							.fill(0)
							.map((_, i) => (
								<SkeletonTheme key={i} color={"#efefef"} highlightColor={"#dbdbdb"}>
									<div className="mb-3">
										<Skeleton height={74} />
									</div>
								</SkeletonTheme>
							))}

					{goals &&
						goals.length > 0 &&
						goals.map((g, i) => {
							return (
								<Item
									variant={
										g.completed
											? "completed"
											: g.archived
											? "archived"
											: "normal"
									}
									key={i}
									{...g}
								/>
							);
						})}

					{/* No Goals*/}
					{goals && goals.length === 0 && (
						<div className="flex h-full flex-col text-center items-center justify-center text-xl text-gray-3">
							{t("noGoals")}
							<Completed className="h-64 w-64 opacity-50 mt-20" />
						</div>
					)}
				</div>
			</div>
		</>
	);
};

function Header() {
	const [t] = useTranslation(strings);

	return (
		<div className="flex justify-between p-5 pl-6 items-center">
			<h1 className={"text-5xl font-bold "}>{t("goals")}</h1>

			<Link to={"/add"} className={"focus:outline-none focus:bg-none"}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					className="h-12 w-12"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
			</Link>
		</div>
	);
}

function Item(
	props: React.ComponentProps<"div"> & Goal & { variant?: "normal" | "completed" | "archived" }
) {
	return (
		<Link
			to={"/goal/" + props.uid}
			className={`${
				props.variant === "completed"
					? "bg-green-200 text-green-800"
					: props.variant === "archived"
					? "text-gray-600"
					: ""
			} relative flex justify-between bg-gray-100 items-center p-5 mb-3 rounded-lg`}
		>
			<div>
				<div className="text-2xl font-medium">{props.title}</div>
				<div
					className={`${
						props.variant === "completed" ? "text-green-700" : "text-gray-600"
					}`}
				>
					{props.description}
				</div>
			</div>
		</Link>
	);
}

function UserIcon(props: { name: string | null; photoURL: string | null }) {
	const [imgNotFound, setImgNotFound] = useState(props.photoURL === null);

	return !imgNotFound ? (
		<motion.img
			initial={{
				height: 0,
				width: 0
			}}
			animate={{
				height: 30,
				width: 30
			}}
			referrerPolicy="no-referrer"
			alt={(props.name ?? "User") + " avatar"}
			onError={_ => setImgNotFound(true)}
			src={props.photoURL ?? "404"}
			className="text-transparent rounded-full border-2 border-gray-200"
		/>
	) : (
		<motion.svg
			initial={{
				height: 0,
				width: 0
			}}
			animate={{
				height: 30,
				width: 30
			}}
			className="text-gray-600 -ml-3 bg-white rounded-full ml-1 border-2 border-gray-200"
			fill="currentColor"
			viewBox="0 0 20 20"
		>
			<path
				d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
				clipRule="evenodd"
				fillRule="evenodd"
			/>
		</motion.svg>
	);
}

export default Dashboard;
