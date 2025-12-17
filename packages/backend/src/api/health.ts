import type { IncomingMessage, ServerResponse } from "http";

const respond = (res: ServerResponse, status: number, body: unknown): void => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
};

export default async function health(
  _req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  respond(res, 200, { ok: true });
}
