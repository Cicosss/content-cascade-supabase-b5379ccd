import type { Config } from "tailwindcss";

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
			fontFamily: {
				'playfair': ['Playfair Display', 'serif'],
				'lora': ['Lora', 'serif'],
				'inter': ['Inter', 'sans-serif'],
				'sans': ['Inter', 'system-ui', 'sans-serif'],
				'serif': ['Playfair Display', 'serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Palette Istituzionale Mia Romagna
				brand: {
					blue: {
						50: '#f0f7ff',
						100: '#e0efff',
						200: '#bae0ff',
						300: '#7cc8ff',
						400: '#36abff',
						500: '#0c8cef',
						600: '#0066cc',
						700: '#0052a3',
						800: '#065296',
						900: '#0F172A', // Blu scuro principale
						950: '#0a0f1a'
					},
					yellow: {
						50: '#fffbeb',
						100: '#fef3c7',
						200: '#fde68a',
						300: '#fcd34d',
						400: '#fbbf24', // Giallo/Arancione principale
						500: '#f59e0b',
						600: '#d97706',
						700: '#b45309',
						800: '#92400e',
						900: '#78350f'
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" }
				},
				'slide-down': {
					"0%": { opacity: "0", transform: "translateY(-10px)", maxHeight: "0" },
					"100%": { opacity: "1", transform: "translateY(0)", maxHeight: "500px" }
				},
				// Weather animation keyframes
				'spin-slow': {
					from: { transform: 'rotate(0deg)' },
					to: { transform: 'rotate(360deg)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'drift': {
					'0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
					'25%': { transform: 'translateX(5px) translateY(-3px)' },
					'50%': { transform: 'translateX(-3px) translateY(-5px)' },
					'75%': { transform: 'translateX(-5px) translateY(3px)' }
				},
				'bounce-gentle': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'shake': {
					'0%, 100%': { transform: 'translateX(0px)' },
					'10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
					'20%, 40%, 60%, 80%': { transform: 'translateX(2px)' }
				},
				'rain-drop': {
					'0%': { transform: 'translateY(0px)', opacity: '1' },
					'100%': { transform: 'translateY(12px)', opacity: '0' }
				},
				'snow-fall': {
					'0%': { transform: 'translateY(0px) translateX(0px)', opacity: '1' },
					'100%': { transform: 'translateY(16px) translateX(2px)', opacity: '0' }
				},
				'lightning': {
					'0%, 50%, 100%': { opacity: '0' },
					'25%, 75%': { opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-in-out',
				'slide-down': 'slide-down 0.3s ease-in-out',
				// Weather animations
				'spin-slow': 'spin-slow 8s linear infinite',
				'float': 'float 4s ease-in-out infinite',
				'drift': 'drift 6s ease-in-out infinite',
				'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
				'shake': 'shake 0.5s ease-in-out infinite',
				'rain-drop': 'rain-drop 1s ease-in infinite',
				'snow-fall': 'snow-fall 2s ease-in infinite',
				'lightning': 'lightning 1.5s ease-in-out infinite'
			},
			// Animation delay utilities
			animationDelay: {
				'0': '0ms',
				'300': '300ms',
				'500': '500ms',
				'600': '600ms',
				'1000': '1000ms'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		// Add animation delay plugin
		function({ addUtilities }) {
			const newUtilities = {
				'.animation-delay-0': {
					'animation-delay': '0ms',
				},
				'.animation-delay-300': {
					'animation-delay': '300ms',
				},
				'.animation-delay-500': {
					'animation-delay': '500ms',
				},
				'.animation-delay-600': {
					'animation-delay': '600ms',
				},
				'.animation-delay-1000': {
					'animation-delay': '1000ms',
				},
			}
			addUtilities(newUtilities)
		}
	],
} satisfies Config;
