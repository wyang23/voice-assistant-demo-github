// This file helps with extending Tailwind's functionality
module.exports = function customPlugin({ addUtilities, matchUtilities, theme }) {
    // Add custom utilities
    addUtilities({
      '.glass-panel': {
        'background-color': 'rgb(0 0 0 / 0.3)',
        'backdrop-filter': 'blur(16px)',
        'border': '1px solid rgb(255 255 255 / 0.1)',
      },
      '.avatar-glow': {
        'box-shadow': '0 0 25px 2px #00c3b5',
      },
      '.avatar-glow-active': {
        'box-shadow': '0 0 30px 5px #00c3b5',
      },
      '.bg-gradient-radial': {
        'background-image': 'radial-gradient(var(--tw-gradient-stops))',
      },
      '.animate-wave': {
        'animation': 'wave 1.5s ease-in-out infinite',
      },
      '.animate-radiate': {
        'animation': 'radiate 2s infinite ease-out',
      },
    });
    
    // Add telecom color utilities
    matchUtilities(
      {
        'bg-telecom': (value) => ({
          'background-color': value,
        }),
        'text-telecom': (value) => ({
          'color': value,
        }),
        'border-telecom': (value) => ({
          'border-color': value,
        }),
        'ring-telecom': (value) => ({
          '--tw-ring-color': value,
        }),
      },
      { values: theme('telecom') }
    );
  };