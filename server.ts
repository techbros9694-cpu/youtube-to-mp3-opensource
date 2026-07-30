import app from "./api/index";
import express from "express";
import path from "path";

const PORT = 3000;

async function startServer() {
  // Integrate Vite for asset serving
  if (process.env.NODE_ENV !== "production") {
    console.log("[Backend] Starting Vite dev server integration...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Backend] Serving production static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Backend] Full-stack server running at http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error("[Backend] Failed to start server:", err);
  });
}

export { app };
export default app;
