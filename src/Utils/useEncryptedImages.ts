import { AES, enc } from "crypto-js";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";

export function useEncryptedImages(urls: string[] | null | undefined) {
	const [user] = useAuthState(firebase.auth());
	const toDataURL = (url: string): Promise<string> => {
		return fetch(url)
			.then(r => r.text())
			.then(t => AES.decrypt(t, user?.uid as string).toString(enc.Utf8));
	};

	const [images, setImages] = useState<string[]>([]);
	useEffect(() => {
		if (urls) {
			Promise.all(urls.map(p => toDataURL(p)))
				.then(p => setImages(p))
				.catch(e => console.error(e));
		}
	}, [urls]);

	return images;
}
