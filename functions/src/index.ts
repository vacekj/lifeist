import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as _ from "lodash";
import Goal from "../../src/Types/Goal.type";

admin.initializeApp();

exports.addProfileForUser = functions.auth.user().onCreate(async user => {
	try {
		return await admin
			.firestore()
			.collection("profiles")
			.doc(user.uid)
			.set({
				instagram: "",
				..._.pick(user, ["displayName", "uid", "photoURL", "createdAt", "email"])
			});
	} catch {
		console.error("Failed to create profile for user", user.toJSON());
		return;
	}
});

exports.addUserToGoal = functions.firestore
	.document("goals/*")
	.onCreate(async (snapshot, context) => {
		const data = snapshot.data() as Goal;
		const user = await admin.auth().getUser(data?.owner_uid);
		if (user) {
			await snapshot.ref.update({
				owner: user.toJSON()
			});
		}
	});
