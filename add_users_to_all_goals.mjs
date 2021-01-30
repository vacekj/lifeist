import admin from "firebase-admin";

admin.initializeApp({
	credential: admin.credential.applicationDefault()
});

admin.firestore().settings({ ignoreUndefinedProperties: true });
console.log('initialed app');
admin
	.firestore()
	.collection("goals")
	.listDocuments()
	.then(async goals => {
		console.log('got docs');
		for (const g of goals) {
			const s = await g.get();
			const data = await s.data();
			console.log(g.id, data.owner != undefined);
			const user = await admin.auth().getUser(data?.owner_uid);
			if (user) {
				await g.update({
					owner: user.toJSON()
				});
				console.log('Added owner to ', g.id);
			}
		}
	});
