import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sitemap from "vite-plugin-sitemap";

// https://vite.dev/config/
export default defineConfig(() => {
	return {
		server: {
			port: 3000,
			host: "0.0.0.0",
		},
		plugins: [
			react(),
			sitemap({
				hostname: "https://tassia-connect.vercel.app/",
			}),
		],
	};
});
