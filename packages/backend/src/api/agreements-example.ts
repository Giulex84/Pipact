import type { IncomingMessage, ServerResponse } from "http";
import type { Agreement } from "@pipact/shared";

const respond = (res: ServerResponse, status: number, body: unknown): void => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
};

export default async function agreementsExample(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  if (req.method !== "GET") {
    respond(res, 405, { ok: false, error: "method_not_allowed" });
    return;
  }

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

  respond(res, 200, { ok: true, example });
}
