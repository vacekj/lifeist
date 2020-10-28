import admin from "firebase-admin";

admin.initializeApp({
	credential: admin.credential.applicationDefault()
});

admin.firestore().settings({ ignoreUndefinedProperties: true });

admin
	.firestore()
	.collection("goals")
	.listDocuments()
	.then(async goals => {
		for (const g of goals) {
			const s = await g.get();
			const data = await s.data();
			const user = await admin.auth().getUser(data?.owner_uid);
			if (user) {
				await g.update({
					owner: user.toJSON()
				});
			}
		}
	});
