import * as firebase from "firebase";

type Memory = {
	owner_uid: string;
	goal_uid: string;
	description: string;
	pictures: string[];
	created_at: firebase.firestore.Timestamp;
	updated_at: firebase.firestore.Timestamp;
};

export default Memory;
