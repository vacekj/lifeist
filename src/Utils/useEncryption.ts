import { useDocumentData } from "react-firebase-hooks/firestore";
import Goal from "../Types/Goal.type";
import * as firebase from "firebase";
import { useEffect, useState } from "react";
import { AES, enc } from "crypto-js";
import { useAuthState } from "react-firebase-hooks/auth";

export function useEncryptedGoalData(
	uid: string | undefined
): [Goal | undefined, boolean, Error | firebase.auth.Error | undefined] {
	const [auth, authLoading, authError] = useAuthState(firebase.auth());
	const [goalDataRaw, loading, error] = useDocumentData<Goal>(
		uid
			? firebase
					.firestore()
					.collection("goals")
					.doc(uid)
			: undefined
	);

	const [goalData, setGoalData] = useState<Goal | undefined>();
	useEffect(() => {
		if (goalDataRaw && auth) setGoalData(decryptGoal(goalDataRaw, goalDataRaw.owner_uid));
	}, [goalDataRaw, auth]);

	return [goalData, loading || authLoading, error || authError];
}

export function decryptGoal(goal: Goal, uid: string) {
	if (goal.encrypted) {
		return Object.assign(goal, {
			title: AES.decrypt(goal.title, uid).toString(enc.Utf8),
			description: AES.decrypt(goal.description, uid).toString(enc.Utf8),
			encrypted: false
		});
	} else {
		return goal;
	}
}
