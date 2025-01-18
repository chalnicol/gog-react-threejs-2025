import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig(({ command }) => ({
	plugins: [react()],
	server: {
		proxy: {
			"/socket.io": {
				target: "http://localhost:3000", // your backend URL
				ws: true, // WebSocket proxying
				changeOrigin: true, // Makes sure that the target server sees the same host as the client
			},
		},
	},
}));
