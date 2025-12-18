import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  ApiError,
  getCurrentUser,
  sendError,
  sendSuccess
} from "@pipact/backend";

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "GET") {
      throw new ApiError(
        405,
        "method_not_allowed",
        "Only GET is allowed for this resource."
      );
    }

    const user = getCurrentUser();
    sendSuccess(res, 200, { user });
  } catch (error) {
    sendError(res, error, "Failed to load current user");
  }
}
