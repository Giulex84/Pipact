import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  ApiError,
  CreateAgreementInput,
  createAgreement,
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
        "Only POST is allowed for agreement creation."
      );
    }

    const currentUser = getCurrentUser();
    const body = (req.body || {}) as Partial<CreateAgreementInput> & {
      note?: string;
      actorId?: string;
    };

    const input: CreateAgreementInput = {
      title: body.title ?? "",
      summary: body.summary ?? "",
      category: body.category as CreateAgreementInput["category"],
      providerId: body.providerId ?? currentUser.id,
      requesterId: body.requesterId ?? currentUser.id,
      deliveryDate: body.deliveryDate
    };

    const agreement = createAgreement(input, {
      actorId: body.actorId ?? currentUser.id,
      note: body.note
    });

    sendSuccess(res, 201, { agreement });
  } catch (error) {
    sendError(res, error, "Failed to create agreement");
  }
}
