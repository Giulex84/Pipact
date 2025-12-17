import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Agreement } from "../../packages/shared/src/models";

const now = new Date().toISOString();

const exampleAgreement: Agreement = {
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

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method && req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      ok: false,
      error: "method_not_allowed",
      message: "Only GET is supported for this endpoint."
    });
  }

  return res.status(200).json({
    ok: true,
    agreement: exampleAgreement
  });
}
