import path from "path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { generateRoadmap } from "./api/_lib/roadmap.js";
import { askFollowUp } from "./api/_lib/followup.js";
import { generateInsights } from "./api/_lib/insights.js";
import { generateResumeKit } from "./api/_lib/resume.js";

type JsonHandler = (body: any) => Promise<unknown>;

// Emulates the Vercel serverless functions during `vite dev`.
function apiRoute(routePath: string, handler: JsonHandler): Plugin {
  return {
    name: `api-dev-middleware:${routePath}`,
    configureServer(server) {
      server.middlewares.use(routePath, (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", async () => {
          try {
            const parsed = JSON.parse(body || "{}");
            const result = await handler(parsed);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
          } catch (err: any) {
            console.error(`${routePath} dev error:`, err);
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
  const apiKey = env.GEMINI_API_KEY;

  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },

    plugins: [
      react(),
      tailwindcss(),
      apiRoute("/api/generate-roadmap", async ({ qualification, interests }) => {
        if (!qualification || !interests) {
          const err: any = new Error("qualification and interests are required");
          err.status = 400;
          throw err;
        }
        return generateRoadmap(qualification, interests, apiKey);
      }),
      apiRoute("/api/ask-followup", async ({ roadmap, question, history }) => {
        if (!roadmap || !question) {
          const err: any = new Error("roadmap and question are required");
          err.status = 400;
          throw err;
        }
        return askFollowUp(roadmap, question, Array.isArray(history) ? history : [], apiKey);
      }),
      apiRoute("/api/roadmap-insights", async ({ qualification, interests, currentSkills, jobTitle }) => {
        if (!qualification || !interests) {
          const err: any = new Error("qualification and interests are required");
          err.status = 400;
          throw err;
        }
        return generateInsights({ qualification, interests, currentSkills, jobTitle }, apiKey);
      }),
      apiRoute("/api/resume-bullets", async ({ jobTitle, qualification, interests, currentSkills, experience }) => {
        if (!jobTitle || !qualification) {
          const err: any = new Error("jobTitle and qualification are required");
          err.status = 400;
          throw err;
        }
        return generateResumeKit({ jobTitle, qualification, interests, currentSkills, experience }, apiKey);
      }),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
