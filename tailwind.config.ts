
import type { Config } from "tailwindcss";
import { colors } from "./src/config/tailwind/colors";
import { fontFamily } from "./src/config/tailwind/typography";
import { keyframes, animation, animationDelay } from "./src/config/tailwind/animations";
import { animationDelayPlugin } from "./src/config/tailwind/plugins";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily,
			colors,
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			perspective: {
				'1000': '1000px'
			},
			keyframes,
			animation,
			animationDelay
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/line-clamp"),
		animationDelayPlugin
	],
} satisfies Config;
