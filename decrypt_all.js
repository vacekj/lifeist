const { AES, enc } = require("crypto-js");
const admin = require("firebase-admin");

function decryptGoal(goal, uid) {
	if (goal.encrypted) {
		const decryptedMemories =
			goal.memories?.length && goal.memories?.length > 0
				? goal.memories.map(m => {
						return {
							photos: m.photos,
							text: AES.decrypt(m.text, uid).toString(enc.Utf8)
						};
				  })
				: [];

		return Object.assign(goal, {
			title: AES.decrypt(goal.title, uid).toString(enc.Utf8),
			description: AES.decrypt(goal.description, uid).toString(enc.Utf8),
			memories: decryptedMemories,
			encrypted: false
		});
	} else {
		return goal;
	}
}

admin.initializeApp({
	credential: admin.credential.applicationDefault()
});

admin.firestore().settings({ ignoreUndefinedProperties: true });

const goals = admin
	.firestore()
	.collection("goals")
	.where("encrypted", "==", true);

admin.firestore().runTransaction(t => {
	return goals.get().then(goals => {
		return goals.docs.forEach(goal => {
			const goaldata = goal.data();
			// console.log(goaldata);
			const decryptedGoal = decryptGoal(goaldata, goaldata.owner_uid);
			console.log(decryptedGoal);
			if (decryptedGoal) {
				return t.update(goal.ref, decryptedGoal);
			}
		});
	});
});
