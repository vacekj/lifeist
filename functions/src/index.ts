import * as firebase from "firebase";
import * as express from "express";

import * as admin from "firebase-admin";

const functions = require("firebase-functions");
admin.initializeApp();

export const getStats = functions.https.onRequest(
	async (_: Request, response: express.Response) => {
		try {
			const snapshot = await admin
				.firestore()
				.collection("goals")
				.get();
			const data = snapshot.docs.map(g => g.data() as Goal);

			/*Pick only anonymous data*/
			return response.json(
				data.map(goal => {
					return { title: goal.title, completed: goal.completed };
				})
			);
		} catch (e) {
			return response.json(e);
		}
	}
);

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
