module.exports = {
  extends: [
		'eslint:recommended', 
		'plugin:@typescript-eslint/recommended', 
		'plugin:@typescript-eslint/recommended-requiring-type-checking', 
		"plugin:@typescript-eslint/strict"
	],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
	ignorePatterns: ["./eslintrc.js"],
	parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
		ecmaVersion: "latest",
    sourceType: "module"
  },
	env: {
		"node": true
	},
  root: true,
};