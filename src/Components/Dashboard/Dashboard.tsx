import React, { useState } from "react";
import * as firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import Goal from "../../Types/Goal.type";
import Modal from "../Modal";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useCollectionData } from "react-firebase-hooks/firestore";
import useTranslation from "../../Utils/useTranslation";
import strings from "./strings";

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

	const [sharedGoals] = useCollectionData<Goal>(
		firebase
			.firestore()
			.collection("goals")
			.where("shared_with", "array-contains", user?.uid ?? "invalid"),
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
			<div className={"flex flex-col"}>
				<Header photoURL={user?.providerData.slice(-1)[0]?.photoURL} />

				<div className="p-3">
					{/*Loading */}
					{loading &&
						Array(5)
							.fill(0)
							.map((_, i) => (
								<SkeletonTheme color={"#232323"} highlightColor={"#444444"}>
									<div className="mb-3">
										<Skeleton height={74} />
									</div>
								</SkeletonTheme>
							))}

					{/*Shared goals*/}
					{sharedGoals?.length !== undefined && sharedGoals.length > 0 && (
						<div className="flex items-center justify-center text-sm text-gray-3 my-3 mt-5">
							{t("sharedWithYou")}
						</div>
					)}

					{sharedGoals &&
						sharedGoals.map((g, i) => {
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

					{/*Goals*/}
					{goals?.length !== undefined && goals.length > 0 && (
						<div className="flex items-center justify-center text-sm text-gray-3 my-3 mt-5">
							{t("yourGoals")}
						</div>
					)}

					{goals &&
						goals?.length > 0 &&
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
						<div className="flex items-center justify-center text-xl text-gray-3">
							{t("noGoals")}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

function Header(props: { photoURL: string | null | undefined }) {
	const [t] = useTranslation(strings);

	return (
		<div className="flex justify-between p-5 pl-6 items-center">
			<Link to={"/profile"}>
				{props.photoURL ? (
					<img
						alt={"profile picture"}
						src={props.photoURL}
						className="h-6 w-6 rounded-full ml-1 border border-white"
					/>
				) : (
					<svg className="text-white w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
							clipRule="evenodd"
							fillRule="evenodd"
						/>
					</svg>
				)}
			</Link>

			<h1 className={"text-3xl font-medium "}>{t("goals")}</h1>

			<Link to={"/add"} className={"focus:outline-none focus:bg-none"}>
				<svg className="text-green-1 w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
					<path
						d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
						clipRule="evenodd"
						fillRule="evenodd"
					/>
				</svg>
			</Link>
		</div>
	);
}

function Item(
	props: React.ComponentProps<"div"> & Goal & { variant?: "normal" | "completed" | "archived" }
) {
	let elem: JSX.Element | undefined;
	switch (props.variant) {
		case "normal":
			elem = (
				<Link
					to={"/goal/" + props.uid}
					className={`hover:bg-background-lightest bg-background-lighter
				flex flex-col p-5 mb-3 rounded bg-background-lighter`}
				>
					<div className="text-lg font-medium">{props.title}</div>
					<div className={"text-gray-2"}>{props.description}</div>
				</Link>
			);
			break;

		case "completed":
			elem = (
				<Link
					to={"/goal/" + props.uid}
					className="hover:bg-green-1 bg-green-1 text-black flex flex-col p-5 mb-3 rounded bg-background-lighter"
				>
					<div className="text-lg font-medium">{props.title}</div>
					<div>{props.description}</div>
				</Link>
			);
			break;

		case "archived":
			elem = (
				<Link
					to={"/goal/" + props.uid}
					className="flex flex-col p-5 mb-3 rounded border border-background-lightest hover:border-gray-800"
				>
					<div className="text-lg text-gray-2 font-medium">{props.title}</div>
					<div className={"text-gray-2"}>{props.description}</div>
				</Link>
			);
			break;

		default:
			elem = (
				<Link
					to={"/goal/" + props.uid}
					className={`hover:bg-background-lightest bg-background-lighter
				flex flex-col p-5 mb-3 rounded bg-background-lighter`}
				>
					<div className="text-lg font-medium">{props.title}</div>
					<div className={"text-gray-2"}>{props.description}</div>
				</Link>
			);
			break;
	}

	return elem;
}

export default Dashboard;
