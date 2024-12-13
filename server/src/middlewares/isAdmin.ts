import { MiddlewareFn } from "type-graphql";
import { AuthService } from "../services/AuthService";
import { AuthorizationError } from "../utils/errors";

const authService = new AuthService();

export const isAdmin: MiddlewareFn<any> = async ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  if (!authorization) {
    throw new AuthorizationError("Not authenticated");
  }

  const token = authorization.split(" ")[1];
  const payload = authService.verifyToken(token);

  if (payload.role !== "ADMIN") {
    throw new AuthorizationError("Not authorized");
  }

  context.user = payload;
  return next();
};
