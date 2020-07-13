import { useState } from "react";
import rosetta from "rosetta";

export default function useTranslation(
	translationfile: Record<string, any>
): [(key: string) => string, (lang: string) => undefined | string] {
	const [i18n] = useState(rosetta(translationfile));
	i18n.locale(window.langCode ?? "cs");

	return [
		i18n.t.bind(i18n),
		(lang: string) => {
			if (lang) {
				window.langCode = lang;
				i18n.locale(lang);
			} else {
				return i18n.locale();
			}
		}
	];
}
