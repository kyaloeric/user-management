import { ApolloError } from "apollo-server-express";

// Custom NotFoundError
export class NotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, "NOT_FOUND"); // "NOT_FOUND" is the error code
    Object.defineProperty(this, 'name', { value: 'NotFoundError' });
  }
}

// Custom ValidationError
export class ValidationError extends ApolloError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR"); // "VALIDATION_ERROR" is the error code
    Object.defineProperty(this, 'name', { value: 'ValidationError' });
  }
}

// Custom AuthorizationError
export class AuthorizationError extends ApolloError {
  constructor(message: string) {
    super(message, "UNAUTHORIZED"); // "UNAUTHORIZED" is the error code
    Object.defineProperty(this, 'name', { value: 'AuthorizationError' });
  }
}
