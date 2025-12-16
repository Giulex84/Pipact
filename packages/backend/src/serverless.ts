import type { IncomingMessage, ServerResponse } from "http";
import { app } from "./app";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    return app(
      req as unknown as Parameters<typeof app>[0],
      res as unknown as Parameters<typeof app>[1]
    );
  } catch (error) {
    console.error("Unhandled invocation error", error);

    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(
      JSON.stringify({ ok: false, error: "internal_error", message: "Unexpected error" })
    );

    return res;
  }
}
