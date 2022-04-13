import { useEffect, useState } from "react";

export function useImages(urls: string[] | null | undefined) {
	const toDataURL = (url: string): Promise<string> => {
		return fetch(url).then(r => r.text());
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
