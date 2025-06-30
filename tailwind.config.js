// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sidebar & Gradient
        'nimbus-gradient-start': '#3A4D8F', // Example: Deep royal/indigo blue (top of sidebar)
        'nimbus-gradient-mid': '#3A76B8',   // Example: Brighter vibrant blue (mid/active items)
        'nimbus-gradient-end': '#4AC0D4',   // Example: Cyan/tealish blue (bottom of sidebar)
        'nimbus-sidebar-text': '#EAF2F8',   // Example: Very light cool gray/off-white
        'nimbus-sidebar-hover': 'rgba(255, 255, 255, 0.1)', // Example: Subtle white overlay on hover
        
        // Main Content & Cards
        'nimbus-main-bg': '#F8F9FA',      // Example: Very light gray (like Tailwind's gray-50 or slate-50)
        'nimbus-card-bg': '#FFFFFF',      // White for cards and content header
        
        // Accents
        'nimbus-primary-accent': '#4A7DFF', // Example: A strong, clear blue (like active sidebar or buttons)
        'nimbus-green-accent': '#10B981',   // Example: Green for positive stats/charts
        'nimbus-red-accent': '#EF4444',     // Example: Red for negative stats/charts

        // Text
        'nimbus-text-dark': '#1F2937',    // Example: Dark cool gray (like Tailwind's gray-800)
        'nimbus-text-medium': '#6B7280',  // Example: Medium gray (like Tailwind's gray-500)
        'nimbus-text-light': '#9CA3AF',   // Example: Lighter gray (like Tailwind's gray-400)
      },
      backgroundImage: theme => ({
        // Define the sidebar gradient using your named colors
        'nimbus-sidebar-gradient': `linear-gradient(to bottom, ${theme('colors.nimbus-gradient-start')}, ${theme('colors.nimbus-gradient-mid')}, ${theme('colors.nimbus-gradient-end')})`,
      }),
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif'],
    },
  },
  plugins: [
    // require('@tailwindcss/forms'), // If you want styled forms
    // require('tailwind-scrollbar'), // For custom scrollbars if needed
  ],
}