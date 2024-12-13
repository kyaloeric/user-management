import { MiddlewareFn } from "type-graphql";
import { ApolloError } from "apollo-server-express";

export const errorMiddleware: MiddlewareFn = async ({ context }, next) => {
  try {
    return await next();
  } catch (err) {
    console.error(err);
    if (err instanceof ApolloError) {
      throw err;
    }
    throw new ApolloError("Internal Server Error", "INTERNAL_SERVER_ERROR");
  }
};
