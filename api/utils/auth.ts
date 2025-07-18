import { Context } from "openapi-backend";
import jwt from 'jsonwebtoken';
import createHttpError from "http-errors";

export const verifyToken = (c: Context) => {
  const authHeader = c.request.headers['authorization'] || c.request.headers['Authorization'];
  if (!authHeader) {
    throw createHttpError(401, 'Missing authorization header');
  }

  const [, token] = authHeader.split(' ');
  if (!token) {
    throw createHttpError(401, 'Missing token');
  }
  
  // @TODO: check jwks signature and verify the signer is epilot
  const claims = jwt.decode(token);
  if (!claims || typeof claims !== 'object') {
    throw createHttpError(401, 'Invalid token');
  }

  const orgId = claims['org_id'] || claims['custom:ivy_org_id'];
  if (!orgId) {
    throw createHttpError(401, 'Invalid token');
  }

  return { token, orgId }
}
