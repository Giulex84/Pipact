import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  ApiError,
  CreateServiceInput,
  createService,
  getCurrentUser,
  listServices,
  sendError,
  sendSuccess
} from "@pipact/backend";

const handleGet = (_req: VercelRequest, res: VercelResponse) => {
  const services = listServices();
  sendSuccess(res, 200, { items: services, total: services.length });
};

const handlePost = (req: VercelRequest, res: VercelResponse) => {
  const currentUser = getCurrentUser();
  const body = (req.body || {}) as Partial<CreateServiceInput>;

  const input: CreateServiceInput = {
    title: body.title ?? "",
    categories: Array.isArray(body.categories) ? body.categories : [],
    shortNote: body.shortNote,
    preferredContact: body.preferredContact,
    available:
      body.available === undefined ? true : Boolean(body.available)
  };

  const service = createService(currentUser.id, input);
  sendSuccess(res, 201, { service });
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      return handleGet(req, res);
    }
    if (req.method === "POST") {
      return handlePost(req, res);
    }

    throw new ApiError(
      405,
      "method_not_allowed",
      "Only GET and POST are allowed for services."
    );
  } catch (error) {
    sendError(res, error, "Failed to process services request");
  }
}
