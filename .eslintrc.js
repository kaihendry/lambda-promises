module.exports = {
	root: true,
	extends: "airbnb-base",
	parserOptions: {
		sourceType: 'module'
	},
	'rules': {
		"no-tabs": 0,
		"semi": 0,
		"indent": ["error", "tab", { "SwitchCase": 1 }],
	}
}
