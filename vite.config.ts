import path from "path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { generateRoadmap } from "./api/_lib/roadmap.js";

function apiDevMiddleware(apiKey: string): Plugin {
  return {
    name: "api-generate-roadmap-dev-middleware",
    configureServer(server) {
      server.middlewares.use("/api/generate-roadmap", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", async () => {
          try {
            const { qualification, interests } = JSON.parse(body || "{}");
            if (!qualification || !interests) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "qualification and interests are required" }));
              return;
            }
            const roadmap = await generateRoadmap(qualification, interests, apiKey);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(roadmap));
          } catch (err: any) {
            console.error("generate-roadmap dev error:", err);
            res.statusCode = err.status || 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },

    plugins: [react(), tailwindcss(), apiDevMiddleware(env.OPENROUTER_API_KEY)],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
