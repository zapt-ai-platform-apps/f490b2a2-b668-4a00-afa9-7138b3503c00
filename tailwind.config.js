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
                    navy: '#1f1f1f',
                    surface: '#303030',
                    background: '#1e1e1e',
                    'user-bubble': '#5e5e5e',
                    'ai-bubble': '#303030',
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