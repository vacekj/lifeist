module.exports = {
	purge: [
		"./src/**/*.tsx",
		"./src/**/*.ts",
		"./src/**/*.jsx",
		"./src/**/*.js",
		"./public/index.html"
	],
	experimental: {
		uniformColorPalette: true
	},
	theme: {
		extend: {
			colors: {
				"brand-primary": "#6059D0",
				"brand-primary-darker": "#4544F5",
				"brand-primary-lightest": "#b3b2fa",
				/*Old colours*/
				"background-primary": "#191919",
				"background-lighter": "#232323",
				"background-lightest": "#2b2b2b",
				"green-1": "#00db6a",
				"green-2": "#12c885",
				"gray-1": "#bcbcbc",
				"gray-2": "#B1B1B1",
				"gray-3": "#6a6a6a"
			}
		}
	},
	variants: {},
	plugins: []
};
