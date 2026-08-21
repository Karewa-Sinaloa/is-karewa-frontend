import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vueDevTools(), vue()],
	server: {
		port: 5174,
		watch: {
			usePolling: true,
		},
		allowedHosts: ['kapp.chavodigital.com'],
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler',
				quietDeps: true,
			},
			sass: {
				api: 'modern-compiler',
				quietDeps: true,
			},
		},
	},
});
