import * as firebase from "firebase";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
// @ts-ignore
admin.initializeApp();

export const getStats = functions.region("europe-west1").https.onRequest(async (_, response) => {
	const goals = await getAllGoals(response);
});

async function getAllGoals(response: functions.Response) {
	const snapshot = await admin
		.firestore()
		.collection("goals")
		.get();
	const data = snapshot.docs.map(g => g.data() as Goal);

	return data.map(goal => {
		return { title: goal.title, completed: goal.completed };
	});
}

type Goal = {
	uid: string;
	title: string;
	description: string;
	owner_uid: string;
	archived: boolean;
	completed: boolean;
	completed_on: firebase.firestore.Timestamp;
	created_at: firebase.firestore.Timestamp;
	updated_at: firebase.firestore.Timestamp;
};
