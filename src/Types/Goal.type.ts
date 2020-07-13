import * as firebase from "firebase";

type Goal = {
	uid: string;
	title: string;
	description: string;
	owner_uid: string;
	archived: boolean;
	completed: boolean;
	shared_with?: string[];
	completed_on: firebase.firestore.Timestamp;
	created_at: firebase.firestore.Timestamp;
	updated_at: firebase.firestore.Timestamp;
};

type Memory = {
	uid: string;
	text: string;
	photos: string[];
};

export default Goal;
