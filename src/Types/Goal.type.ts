import firebase from "firebase";

type Goal = {
	uid: string;
	title: string;
	description: string;
	owner_uid: string;
	archived: boolean;
	completed: boolean;
	public?: boolean;
	completed_on?: firebase.firestore.Timestamp;
	created_at: firebase.firestore.Timestamp;
	updated_at: firebase.firestore.Timestamp;
	owner: firebase.User & User;
};

type User = {
	instagram: string;
};

export default Goal;
