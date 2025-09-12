
module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { background:"#0f1115", surface:"#171923", accent:"#22d3ee" },
      borderRadius: { '2xl':'1rem' },
      boxShadow: { 'soft':'0 10px 30px -10px rgba(0,0,0,0.4)' }
    },
  },
  plugins: [],
}
