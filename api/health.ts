import type { VercelRequest, VercelResponse } from "@vercel/node";

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
    message: "PiPact API is healthy",
    runtime: "nodejs20.x",
    timestamp: new Date().toISOString()
  });
}
