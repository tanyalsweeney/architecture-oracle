import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { architectureHandler } from "./routes/architecture";
import { healthHandler } from "./routes/health";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", healthHandler);
app.post("/architecture", architectureHandler);

app.get("/", (_req, res) => {
  res.json({
    message: "Architecture Oracle API",
    docs: "/health"
  });
});

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API ready on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});
