import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
	plugins: [react()],
	server: {
		proxy: {
			"/socket.io": {
				target: "http://localhost:3000", // your backend URL
				ws: true, // WebSocket proxying
				changeOrigin: true, // Ensures target server sees the same host as client
			},
		},
	},
}));
