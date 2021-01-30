import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

export function useLiveInput<T>(docRef: firebase.firestore.DocumentReference, field: string) {
	const [data, loading, error] = useDocumentData<T & { [property: string]: any }>(docRef);
	const [value, setValue] = useState("");
	useEffect(() => {
		if (data !== undefined) {
			setValue(data[field]);
		}
	}, [data, loading, error, field]);

	const onBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
		// dont write if nothing changed
		if (e.target.value === value) {
			return;
		}
		await docRef.update({
			[field]: e.target.value
		});
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	return {
		value,
		onBlur,
		onChange
	};
}
