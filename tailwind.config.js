/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			boxShadow: {
				"inner-soft-dark": "inset 0 1px 4px rgba(45, 45, 45, 0.5)",
			},
		},
	},
	plugins: [],
};
