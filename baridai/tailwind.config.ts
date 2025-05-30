import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
	  keyframes: {
		fadeIn: {
		  '0%': { opacity: '0', transform: 'translateY(10px)' },
		  '100%': { opacity: '1', transform: 'translateY(0)' }
		},
		slideInRight: {
		  '0%': { opacity: '0', transform: 'translateX(20px)' },
		  '100%': { opacity: '1', transform: 'translateX(0)' }
		},
		gradient: {
		  '0%': { backgroundPosition: '0% 50%' },
		  '50%': { backgroundPosition: '100% 50%' },
		  '100%': { backgroundPosition: '0% 50%' }
		},
		typing: {
		  '0%': { width: '0' },
		  '100%': { width: '100%' }
		},
		'accordion-down': {
		  from: {
			height: '0'
		  },
		  to: {
			height: 'var(--radix-accordion-content-height)'
		  }
		},
		'accordion-up': {
		  from: {
			height: 'var(--radix-accordion-content-height)'
		  },
		  to: {
			height: '0'
		  }
		}
	  },
	  animation: {
		fadeIn: 'fadeIn 0.6s ease-out forwards',
		slideInRight: 'slideInRight 0.6s ease-out forwards',
		gradient: 'gradient 3s ease infinite',
		'accordion-down': 'accordion-down 0.2s ease-out',
		'accordion-up': 'accordion-up 0.2s ease-out'
	  },
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
		// keyframes and animation merged above to avoid duplicate keys
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' }
        }
		}
	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
