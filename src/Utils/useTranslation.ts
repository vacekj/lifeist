import rosetta from "rosetta";
import { useState } from "react";
import { createLocalStorageStateHook } from "use-local-storage-state";

const useLang = createLocalStorageStateHook("lang", window.navigator.language.slice(0, 2));

export default function useTranslation(
	translationfile: Record<string, any>
): [(key: string) => string, (lang?: string) => undefined | string] {
	const [langCode, setLangCode] = useLang();
	const [i18n] = useState(rosetta(translationfile));
	i18n.locale(langCode);

	return [
		i18n.t.bind(i18n),
		(lang?: string) => {
			if (lang) {
				setLangCode(lang);
				i18n.locale(lang);
			} else {
				return i18n.locale();
			}
		}
	];
}
