import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase";

const Community = () => {
	const [publicGoals, loading, error] = useCollectionData(
		firebase
			.firestore()
			.collection("goals")
			.where("public", "==", true)
	);
	return <div>{}</div>;
};

export default Community;
