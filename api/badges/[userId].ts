import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  ApiError,
  listBadges,
  sendError,
  sendSuccess,
  touchUser
} from "@pipact/backend";

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "GET") {
      throw new ApiError(
        405,
        "method_not_allowed",
        "Only GET is allowed for badges."
      );
    }

    const queryUser = req.query.userId;
    const userId = Array.isArray(queryUser) ? queryUser[0] : queryUser;
    if (!userId) {
      throw new ApiError(400, "invalid_request", "userId is required.");
    }

    touchUser(userId);
    const badges = listBadges(userId);
    sendSuccess(res, 200, { badges, total: badges.length });
  } catch (error) {
    sendError(res, error, "Failed to load badges");
  }
}
