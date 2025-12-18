import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  res.status(200).json({
    service: "pipact-backend",
    routes: [
      "/api/ping",
      "/api/health",
      "/api/healthz",
      "/api/users/me",
      "/api/services",
      "/api/agreements",
      "/api/agreements/:id",
      "/api/agreements/:id/accept",
      "/api/agreements/:id/mark-delivered",
      "/api/badges/:userId"
    ]
  });
}
