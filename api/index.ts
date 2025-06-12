import { OpenAPIBackend, type Request } from "openapi-backend";
import type { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { definition } from "./definition";
import * as hooksHandlers from "./hooks/hooks-handlers";
import { handleErrors, replyJSON } from "./utils/lambda";
import { logger } from "./utils/logger";

const api = new OpenAPIBackend({ definition, quick: true });

api.register({
  // hooks handlers
  listHookSubscriptions: hooksHandlers.listHookSubscriptions,
  subscribeHook: hooksHandlers.subscribeHook,
  unsubscribeHook: hooksHandlers.unsubscribeHook,
  receiveHook: hooksHandlers.receiveHook,

  // default handlers
  notFound: () => replyJSON(
    {err: "not found"},
    { statusCode: 404 }
  ),
  validationFail: (c) => replyJSON(
    { err: c.validation.errors },
    { statusCode: 400 }
  ),
  notImplemented: async (c, _event: APIGatewayProxyEventV2) => {
    const { status, mock } = c.api.mockResponseForOperation(
      c.operation.operationId!
    );

    return replyJSON(mock, { statusCode: status })
  },
  postResponseHandler: async (c, _event: APIGatewayProxyEventV2) => {
    logger.info('done', { status: c.response.statusCode, operation: c.operation?.operationId, response: c.response, request: c.request })

    return c.response
  }
});

export async function handler(event: APIGatewayProxyEventV2, context: Context) {
  await api.init();

  return await api.handleRequest(
    {
      method: event.requestContext.http.method,
      path: event.rawPath,
      query: event.rawQueryString,
      body: event.body,
      headers: event.headers as Request["headers"],
    },
    event,
    context
  ).catch(handleErrors);
};
