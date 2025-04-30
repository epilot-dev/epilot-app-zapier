import { OpenAPIBackend, type Request } from "openapi-backend";
import Lambda from "aws-lambda";
import { definition } from "./definition";
import { Logger } from '@aws-lambda-powertools/logger';


const headers = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
};

const logger = new Logger({ serviceName: 'zapier-app' });

const api = new OpenAPIBackend({ definition, quick: true });

api.register({
  notFound: async (c, event: Lambda.APIGatewayProxyEventV2) => ({
    statusCode: 404,
    body: JSON.stringify({ err: "not found" }),
    headers,
  }),
  validationFail: async (c, event: Lambda.APIGatewayProxyEventV2) => ({
    statusCode: 400,
    body: JSON.stringify({ err: c.validation.errors }),
    headers,
  }),
  notImplemented: async (c, event: Lambda.APIGatewayProxyEventV2) => {
    const { status, mock } = c.api.mockResponseForOperation(
      c.operation.operationId!
    );

    return {
      statusCode: status,
      body: JSON.stringify(mock),
      headers,
    };
  },
  postResponseHandler: async (c, event: Lambda.APIGatewayProxyEventV2) => {
    logger.info('done', { request: c.request, event })

    return c.response
  }
});

api.init();

export async function handler(event: Lambda.APIGatewayProxyEventV2, context: Lambda.Context) {
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
  );
};
