import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  ApiError,
  acceptAgreement,
  getAgreementById,
  getCurrentUser,
  sendError,
  sendSuccess
} from "@pipact/backend";

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      throw new ApiError(
        405,
        "method_not_allowed",
        "Only POST is allowed for acceptance."
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

    const currentUser = getCurrentUser();
    const body = (req.body || {}) as { actorId?: string; note?: string };
    const actorId = body.actorId ?? currentUser.id;

    const updated = acceptAgreement(agreement, {
      actorId,
      note: body.note
    });

    sendSuccess(res, 200, { agreement: updated });
  } catch (error) {
    sendError(res, error, "Failed to accept agreement");
  }
}
