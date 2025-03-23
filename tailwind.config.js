export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gemini: {
                    blue: '#8ab4f8',
                    purple: '#c58af9',
                    teal: '#78d9ec',
                    navy: '#202124',
                    surface: '#303134',
                    background: '#202124',
                    'user-bubble': '#444746',
                    'ai-bubble': '#303134',
                }
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            },
            boxShadow: {
                'gemini': '0 2px 6px rgba(0, 0, 0, 0.15)',
            }
        },
    },
    plugins: [],
};