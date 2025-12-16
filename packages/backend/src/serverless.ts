import type { IncomingMessage, ServerResponse } from "http";
import { app } from "./app";

const handler = (req: IncomingMessage, res: ServerResponse) =>
  app(req as unknown as Parameters<typeof app>[0], res as unknown as Parameters<typeof app>[1]);

export default handler;
export { handler };
