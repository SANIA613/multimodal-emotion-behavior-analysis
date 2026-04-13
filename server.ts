import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import Database from "better-sqlite3";

const dbPath = path.resolve(process.cwd(), "emotions.db");
const db = new Database(dbPath);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    face_emotion TEXT,
    voice_emotion TEXT,
    text_sentiment TEXT,
    multimodal_analysis TEXT,
    behavioral_report TEXT,
    user_id TEXT
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get("/api/reports", (req, res) => {
    try {
      const reports = db.prepare("SELECT * FROM reports ORDER BY timestamp DESC").all();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  app.post("/api/reports", (req, res) => {
    const { face_emotion, voice_emotion, text_sentiment, multimodal_analysis, behavioral_report, user_id } = req.body;
    try {
      const info = db.prepare(`
        INSERT INTO reports (face_emotion, voice_emotion, text_sentiment, multimodal_analysis, behavioral_report, user_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(face_emotion, voice_emotion, text_sentiment, multimodal_analysis, behavioral_report, user_id || 'anonymous');
      
      res.json({ id: info.lastInsertRowid, status: "success" });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to save report" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
