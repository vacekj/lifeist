import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as express from "express";
import _ = require("lodash");

admin.initializeApp();
const cookieParser = require("cookie-parser")();
const cors = require("cors")({ origin: true });
const bodyParser = require("body-parser");
const app = express();

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (
		(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) &&
		!(req.cookies && req.cookies.__session)
	) {
		console.error(
			"No Firebase ID token was passed as a Bearer token in the Authorization header.",
			"Make sure you authorize your request by providing the following HTTP header:",
			"Authorization: Bearer <Firebase ID Token>",
			'or by passing a "__session" cookie.'
		);
		res.status(403).send("Unauthorized");
		return;
	}

	let idToken;
	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
		console.log('Found "Authorization" header');
		// Read the ID Token from the Authorization header.
		idToken = req.headers.authorization.split("Bearer ")[1];
	} else if (req.cookies) {
		// Read the ID Token from cookie.
		idToken = req.cookies.__session;
	} else {
		// No cookie
		res.status(403).send("Unauthorized");
		return;
	}

	try {
		// @ts-ignore
		req.user = await admin.auth().verifyIdToken(idToken);
		next();
		return;
	} catch (error) {
		console.error("Error while verifying Firebase ID token:", error);
		res.status(403).send("Unauthorized");
		return;
	}
};

app.use(cors);
app.use(bodyParser.json());
app.use(cookieParser);
app.use(validateFirebaseIdToken);

app.post("/getUserByEmail", async (req, res) => {
	try {
		const user = await admin.auth().getUserByEmail(req.body.email);
		return res.json({
			uid: user.uid,
			email: user.email,
			displayName: user.displayName,
			photoURL: user.photoURL
		});
	} catch (e) {
		return res.json(e);
	}
});

app.post("/getUserByUid", async (req, res) => {
	try {
		const user = await admin.auth().getUser(req.body.uid);
		return res.json({
			uid: user.uid,
			email: user.email,
			displayName: user.displayName,
			photoURL: user.photoURL
		});
	} catch (e) {
		return res.json(e);
	}
});

app.post("/getUsersByUids", async (req, res) => {
	try {
		const promises = req.body.uids.map((uid: string) => admin.auth().getUser(uid));
		console.log(promises);
		const users: admin.auth.UserRecord[] = await Promise.all(promises);
		console.log(users);
		return res.json(
			users.map(user => {
				return {
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
					photoURL: user.photoURL
				};
			})
		);
	} catch (e) {
		return res.json(e);
	}
});

exports.app = functions.region("europe-west1").https.onRequest(app);

exports.addProfileForUser = functions.auth.user().onCreate(async u => {
	try {
		return await admin
			.firestore()
			.collection("profiles")
			.doc(u.uid)
			.set({
				instagram: "",
				..._.pick(u, ["displayName", "uid", "photoURL", "createdAt", "email"])
			});
	} catch {
		console.error("Failed to create profile for user", u.toJSON());
		return;
	}
});
