import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  ApiError,
  getAgreementById,
  sendError,
  sendSuccess
} from "@pipact/backend";

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "GET") {
      throw new ApiError(
        405,
        "method_not_allowed",
        "Only GET is allowed for agreement lookup."
      );
    }

    const agreementId = req.query.id;
    const id = Array.isArray(agreementId) ? agreementId[0] : agreementId;

    if (!id) {
      throw new ApiError(400, "invalid_request", "Agreement id is required.");
    }

    const agreement = getAgreementById(id);
    if (!agreement) {
      throw new ApiError(
        404,
        "not_found",
        `Agreement ${id} was not found.`
      );
    }

    sendSuccess(res, 200, { agreement });
  } catch (error) {
    sendError(res, error, "Failed to load agreement");
  }
}
