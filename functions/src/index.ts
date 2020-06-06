import * as firebase from "firebase";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
// @ts-ignore
admin.initializeApp();

export const getStats = functions.region("europe-west1").https.onCall(async data => {
	return await getAllGoals();
});

async function getAllGoals() {
	const snapshot = await admin
		.firestore()
		.collection("goals")
		.get();
	const data = snapshot.docs.map(g => g.data() as Goal);

	return data.map(goal => {
		return { title: goal.title, completed: goal.completed };
	});
}

export const getUserByEmail = functions.region("europe-west1").https.onCall(async data => {
	try {
		const user = await admin.auth().getUserByEmail(data.email);
		return {
			uid: user.uid,
			email: user.email,
			displayName: user.displayName,
			photoUrl: user.photoURL
		};
	} catch (e) {
		return e;
	}
});

export const getUserByUid = functions.region("europe-west1").https.onCall(async data => {
	try {
		const user = await admin.auth().getUser(data.uid);
		return {
			uid: user.uid,
			email: user.email,
			displayName: user.displayName,
			photoUrl: user.photoURL
		};
	} catch (e) {
		return e;
	}
});

type Goal = {
	uid: string;
	title: string;
	description: string;
	owner_uid: string;
	archived: boolean;
	completed: boolean;
	/** Array of user UIDs with which the Goal was shared */
	shared_with?: string[];
	completed_on: firebase.firestore.Timestamp;
	created_at: firebase.firestore.Timestamp;
	updated_at: firebase.firestore.Timestamp;
};
