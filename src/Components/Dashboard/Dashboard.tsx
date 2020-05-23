import React, { useState } from "react";
import * as firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import Goal from "../../Types/Goal.type";
import Modal from "../Modal";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
// @ts-ignore
import { Fade } from "react-reveal";
import { useCollectionData } from "react-firebase-hooks/firestore";

const Dashboard = () => {
	const [error, setError] = useState<any>(null);

	const [user, loading, authError] = useAuthState(firebase.auth());
	const [goals, goalsLoading, goalsError] = useCollectionData<Goal>(
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
				There was an error loading your bucketlist.
			</Modal>
			<div className={"flex flex-col"}>
				<Header />

				<div className="p-3">
					{/*Loading */}
					{loading &&
						Array(5)
							.fill(0)
							.map(() => (
								<Fade>
									<SkeletonTheme color={"#232323"} highlightColor={"#444444"}>
										<div className="mb-3">
											<Skeleton height={24} />
											<Skeleton height={50} />
										</div>
									</SkeletonTheme>
								</Fade>
							))}

					{/*Goals*/}
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
						<div className="flex items-center justify-center text-xl text-gray-700">
							Add a goal by tapping the Plus icon
						</div>
					)}
				</div>
			</div>
		</>
	);
};

function Header() {
	return (
		<div className="flex justify-between p-5 pl-6 items-center">
			<h1 className={"text-3xl font-medium "}>My bucketlist</h1>
			<Link to={"/add"} className={"focus:outline-none focus:bg-none"}>
				<svg
					className="text-green-primary w-10 h-10"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
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
	let elem: JSX.Element | undefined = undefined;
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
					className="hover:bg-green-primary bg-green-primary text-black flex flex-col p-5 mb-3 rounded bg-background-lighter"
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

	return <Fade>{elem}</Fade>;
}

export default Dashboard;
