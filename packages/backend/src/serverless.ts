import type { IncomingMessage, ServerResponse } from "http";
import { app } from "./app";

const expressApp = app as unknown as {
  handle: (req: IncomingMessage, res: ServerResponse) => void;
};

const handler = (req: IncomingMessage, res: ServerResponse) => {
  expressApp.handle(req, res);
};

export default handler;
export { handler };
