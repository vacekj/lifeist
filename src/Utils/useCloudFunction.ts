import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import { useAuthState } from "react-firebase-hooks/auth";
import { useQuery } from "react-query";

function firebaseFetcher(name: string, data: any) {
	const endpointUrl =
		process.env.FIREBASE_ENV === "local"
			? "http://localhost:5001/bucketlist-84978/europe-west1/app/"
			: "https://europe-west1-bucketlist-84978.cloudfunctions.net/app/";

	// @ts-ignore
	return firebase
		.auth()
		.currentUser.getIdToken()
		.then(t => {
			return fetch(endpointUrl + name, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					Authorization: "Bearer " + t,
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				mode: "cors"
			}).then(res => res.json());
		});
}

export function useFunction<T>(name: string, data: any, enabled?: any) {
	const [user] = useAuthState(firebase.auth());
	return useQuery<T, any>({
		queryKey: [name, data],
		queryFn: firebaseFetcher,
		config: {
			enabled: Boolean(enabled) && Boolean(user)
		}
	});
}

export function useFunctionCall<T>(name: string) {
	return (data: any): Promise<T> => firebaseFetcher(name, data);
}
