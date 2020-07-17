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
import _ from "lodash";
import { useFunction } from "../../Utils/useCloudFunction";

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

	const allGoals = _.uniqBy(goals?.concat(sharedGoals ?? []), "uid");

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
								<SkeletonTheme key={i} color={"#232323"} highlightColor={"#444444"}>
									<div className="mb-3">
										<Skeleton height={74} />
									</div>
								</SkeletonTheme>
							))}

					{allGoals &&
						allGoals?.length > 0 &&
						allGoals.map((g, i) => {
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
					width="25"
					height="25"
					viewBox="0 0 25 25"
					className="h-12 w-12"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle cx="12.5" cy="12.5" r="12.5" fill="#4544F5" />
					<rect x="12" y="7" width="1" height="11" rx="0.5" fill="#EEEEEE" />
					<rect
						x="18"
						y="12"
						width="1"
						height="11"
						rx="0.5"
						transform="rotate(90 18 12)"
						fill="#EEEEEE"
					/>
				</svg>
			</Link>
		</div>
	);
}

function Item(
	props: React.ComponentProps<"div"> & Goal & { variant?: "normal" | "completed" | "archived" }
) {
	const sharedWithUserResponse = useFunction<User[]>(
		"getUsersByUids",
		{
			uids: props.shared_with
		},
		props.shared_with
	);

	return (
		<Link
			to={"/goal/" + props.uid}
			className={`relative flex justify-between items-center shadow-lg p-5 mb-3 rounded-lg`}
		>
			<div>
				<div className="text-2xl font-medium">{props.title}</div>
				<div className={"text-gray-2"}>{props.description}</div>
			</div>
			<div className="absolute top-0 right-0 flex items-center m-6">
				{[
					sharedWithUserResponse.data?.map(p => (
						<UserIcon key={p.uid} name={p.displayName} photoURL={p.photoURL} />
					))
				]}
			</div>
		</Link>
	);
}

function UserIcon(props: { name: string | null; photoURL: string | null }) {
	const [imgNotFound, setImgNotFound] = useState(props.photoURL === null);

	return !imgNotFound ? (
		<img
			referrerPolicy="no-referrer"
			alt={(props.name ?? "User") + " avatar"}
			onError={_ => setImgNotFound(true)}
			src={props.photoURL ?? "404"}
			className="h-8 w-8 -ml-3 rounded-full ml-1 border-2 border-gray-200"
		/>
	) : (
		<svg
			className="text-gray-600 -ml-3 bg-white w-8 h-8 rounded-full ml-1 border-2 border-gray-200"
			fill="currentColor"
			viewBox="0 0 20 20"
		>
			<path
				d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
				clipRule="evenodd"
				fillRule="evenodd"
			/>
		</svg>
	);
}

export default Dashboard;
