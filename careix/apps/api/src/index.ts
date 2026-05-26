import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import petsRoutes from "./routes/pets";
import aiRoutes from "./routes/ai";

const app = express();
const port = Number(process.env.PORT) || 3001;
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);
app.use("/pets", petsRoutes);
app.use("/ai", aiRoutes);

app.listen(port, () => {
  console.log(`Careix API http://localhost:${port}`);
});
