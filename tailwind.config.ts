
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
        code: ['monospace'],
      },
      // Extend the theme with the new UI palette
          colors: {

            // Preserve existing theme colors
            theme1: '#7C3AED',
            theme2: '#8B5CF6',
            theme3: '#A78BFA',
            theme4: '#F8FAFC',
            background: 'hsl(var(--background))',
            foreground: 'hsl(var(--foreground))',
            card: {
              DEFAULT: 'hsl(var(--card))',
              foreground: 'hsl(var(--card-foreground))',
            },
            popover: {
              DEFAULT: 'hsl(var(--popover))',
              foreground: 'hsl(var(--popover-foreground))',
            },
            primary: {
              DEFAULT: 'hsl(var(--primary))',
              foreground: 'hsl(var(--primary-foreground))',
              indigo: '#4F46E5',
              royal: '#2563EB',
            },
            secondary: {
              DEFAULT: 'hsl(var(--secondary))',
              foreground: 'hsl(var(--secondary-foreground))',
              violet: '#EEF2FF',
              gray: '#F8FAFC',
            },
            muted: {
              DEFAULT: 'hsl(var(--muted))',
              foreground: 'hsl(var(--muted-foreground))',
            },
            accent: {
              DEFAULT: 'hsl(var(--accent))',
              foreground: 'hsl(var(--accent-foreground))',
              green: '#10B981',
              orange: '#F97316',
            },
            destructive: {
              DEFAULT: 'hsl(var(--destructive))',
              foreground: 'hsl(var(--destructive-foreground))',
            },
            border: 'hsl(var(--border))',
            input: 'hsl(var(--input))',
            ring: 'hsl(var(--ring))',
            chart: {
              '1': 'hsl(var(--chart-1))',
              '2': 'hsl(var(--chart-2))',
              '3': 'hsl(var(--chart-3))',
              '4': 'hsl(var(--chart-4))',
              '5': 'hsl(var(--chart-5))',
            },
          },
          // Adjust border radius for cards (16‑20px range)
          borderRadius: {
            lg: '20px', // large cards
            md: '18px', // medium cards
            sm: '16px', // small cards
          },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'ticker': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'blob': {
            '0%, 100%': {
                transform: 'translate(0, 0) scale(1)',
            },
            '33%': {
                transform: 'translate(20px, -30px) scale(1.05)',
            },
            '66%': {
                transform: 'translate(-15px, 15px) scale(0.95)',
            },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'ticker': 'ticker 12s linear infinite',
        'blob': 'blob 8s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
