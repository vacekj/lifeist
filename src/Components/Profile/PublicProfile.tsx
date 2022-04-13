import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Profile } from "../../Types/Profile.type";

const PublicProfile = () => {
	const { id } = useParams<{ id: string }>();
	const [userData] = useDocumentData<Profile>(
		firebase
			.firestore()
			.collection("profiles")
			.doc(id)
	);
	console.log(userData?.instagram);

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
			</div>

			<div className="flex flex-col items-center justify-center p-5">
				{userData?.photoURL ? (
					<img
						referrerPolicy="no-referrer"
						className="mb-3 w-24 h-24 rounded-full border-background-lightest border-2"
						src={userData?.photoURL}
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
				<div className="text-3xl">{userData?.displayName}</div>
				<div className="text-gray-600">{userData?.email}</div>
				<div>Instagram: {userData?.instagram}</div>
			</div>
		</div>
	);
};

export default PublicProfile;
