import * as firebase from "firebase";

type Goal = {
	uid: string;
	title: string;
	description: string;
	owner_uid: string;
	completed: boolean;
	completed_on: firebase.firestore.Timestamp;
};

export default Goal;
