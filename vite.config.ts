import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from '@rollup/plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			input: process.cwd(),
		},
	},
	plugins: [
		{
			...eslint({ throwOnError: true, include: ['src/**/*.{js,jsx,ts,tsx}'] }),
			enforce: 'pre',
		},
		react(),
	],
});
