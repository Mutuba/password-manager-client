// tailwind.config.js
module.exports = {
  content: ["./index.html", "./App.css", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "vault-background": "url('/src/assets/images/vault-background.svg')",
        "vault-bg": "url('/src/assets/images/vault-bg.svg')",
      },
    },
  },
  plugins: [],
};
