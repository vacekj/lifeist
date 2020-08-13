import * as firebase from "firebase";

type Goal = {
	uid: string;
	title: string;
	description: string;
	owner_uid: string;
	archived: boolean;
	completed: boolean;
	shared_with?: string[];
	encrypted?: boolean;
	completed_on?: firebase.firestore.Timestamp;
	created_at: firebase.firestore.Timestamp;
	updated_at: firebase.firestore.Timestamp;
	memories?: Memory[];
};

type Memory = {
	uid: string;
	text: string;
	/***
	 * Path to encrypted photo in Cloud Firestore
	 ***/
	photos: string[];
	created_at: firebase.firestore.Timestamp;
	updated_at: firebase.firestore.Timestamp;
};

export default Goal;
