/** @type {import('tailwindcss').Config} */

import { tailwindConfig } from '@epilot/core-ui';

export default {
  presets: [tailwindConfig],
  content: [
    './src/**/*.tsx',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
