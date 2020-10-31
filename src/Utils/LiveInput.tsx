import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

export function LiveInput<T>(
	props: React.ComponentProps<"input"> & {
		docRef: firebase.firestore.DocumentReference;
		field: string;
	}
) {
	const [data, loading, error] = useDocumentData<T & { [property: string]: any }>(props.docRef);
	const [value, setValue] = useState("");
	useEffect(() => {
		if (data !== undefined) {
			setValue(data[props.field]);
		}
	}, [data, loading, error, props.field]);
	return (
		<input
			className={props.className}
			defaultValue={value}
			onBlur={async e => {
				// dont write if nothing changed
				if (e.target.value === value) {
					return;
				}
				await props.docRef.update({
					[props.field]: e.target.value
				});
			}}
		/>
	);
}
