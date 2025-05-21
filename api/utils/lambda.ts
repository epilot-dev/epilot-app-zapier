import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import type { HandlerResponse } from "../openapi.d.ts";
import { isHttpError } from "http-errors";
import { logger } from "./logger";

/**
 * Utility to create JSON result object with defaults
 */
export function replyJSON<T>(
  json: T,
  opts?: Partial<APIGatewayProxyStructuredResultV2>,
): HandlerResponse<T, APIGatewayProxyStructuredResultV2> {
  const defaultHeaders = {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
  };

  return {
    isBase64Encoded: false,
    statusCode: 200,
    body: json ? JSON.stringify(json) : '',
    ...opts,
    headers: {
      ...defaultHeaders,
      ...opts?.headers,
    },
  };
}

/**
 * Convert error into JSON response
 */
export const handleErrors = (err: Error) => {
  if (isHttpError(err)) {
    // render http errors thrown by handler as JSON
    const { statusCode, message } = err;
    logger.info('done - http error', {
      statusCode,
      error: message,
    });

    return replyJSON({ status: statusCode, error: message }, { statusCode });
  } else {
    // log non-http errors thrown by handlers and return an opaque 500
    logger.error('API error', { error: err });

    return replyJSON({ status: 500, error: 'Unknown API error' }, { statusCode: 500 });
  }
};
