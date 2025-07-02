import { JwtUserPayload } from "./types";

declare global {
  namespace Express {
    interface Request {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user?: JwtUserPayload; // ou interface personalizada
    }
  }
}
