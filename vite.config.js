import { defineConfig } from "vite";
import istanbul from "vite-plugin-istanbul";

export default defineConfig({
  build: { sourcemap: true },
  plugins: [
    istanbul({
      include: ["src/**/*"],
      exclude: ["node_modules"],
      requireEnv: false,
    }),
  ],
});

// export default defineConfig({
//   plugins: [],
//   server: {
//     port: 5173, // Sets a consistent port (default is 5173)
//     open: true, // Automatically opens the browser on start
//     proxy: {
//       // Redirects API calls to your backend to avoid CORS issues
//       "/api": {
//         target: "http://localhost:3000",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
//   build: {
//     outDir: "dist", // Where the production build will go
//     sourcemap: true, // Useful for debugging local production builds
//   },
// });
