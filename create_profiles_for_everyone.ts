import admin from "firebase-admin";

admin.initializeApp({
	credential: admin.credential.applicationDefault()
});

admin.firestore().settings({ ignoreUndefinedProperties: true });

async function main() {
	const users: admin.auth.UserRecord[] = await admin
		.auth()
		.listUsers()
		.then(res => res.users);
	for (const u of users) {
		await admin
			.firestore()
			.collection("profiles")
			.doc(u.uid)
			.set(
				{
					email: u.email,
					displayName: u.displayName,
					photoURL: u.photoURL
				},
				{ merge: true }
			);
		console.log("Created profile for user", u.email);
	}
}

main().then(() => process.exit(0));
