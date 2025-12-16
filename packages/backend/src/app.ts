import express, {
  type NextFunction,
  type Request,
  type Response
} from "express";
import type { Agreement } from "@pipact/shared";

export const app = express();
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

app.get("/health", (_req: Request, res: Response) => {
  const now = new Date().toISOString();
  const example: Agreement = {
    id: "example",
    title: "Example agreement",
    summary: "Health check payload for monitoring",
    category: "OTHER",
    participants: [
      { userId: "client", role: "requester" },
      { userId: "worker", role: "provider" }
    ],
    status: "CREATED",
    createdAt: now,
    updatedAt: now,
    history: [
      {
        at: now,
        by: "client",
        action: "CREATE",
        note: "Initial health check data"
      }
    ]
  };
  res.json({ ok: true, example });
});

app.use(
  (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled error while processing request", err);
    if (res.headersSent) {
      return;
    }

    res
      .status(500)
      .json({ ok: false, error: "internal_error", message: "Unexpected error" });
  }
);
