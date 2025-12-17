import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Agreement } from "@pipact/shared";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const now = new Date().toISOString();

  const example: Agreement = {
    id: "example-agreement",
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

  res.status(200).json({ ok: true, agreement: example });
}
