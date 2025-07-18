/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "epilot-app-zapier",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },

  async run() {
    const stage = $app.stage.startsWith('prod') ? "" : $app.stage;

    const api = new sst.aws.ApiGatewayV2("ZapierApi", {
      domain: ['zapier-app', 'sls', stage, 'epilot.io'].filter(Boolean).join('.'), 
      cors: {
        allowOrigins: ["*"],
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
      }
    });

    const table = new sst.aws.Dynamo("ZapierIntegrationTable", {
      fields: {
        pk: 'string',
        sk: 'string',
      },
      primaryIndex: {
        hashKey: 'pk',
        rangeKey: 'sk'
      }
    });

    for (const method of ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']) {
      api.route(`${method} /{proxy+}`, {
        handler: "api/index.handler",
        runtime: "nodejs22.x",
        architecture: 'arm64',
        link: [table],
        permissions: [
          {
            actions: ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:DeleteItem", "dynamodb:Query"],
            resources: [table.arn],
          }
        ],
      });
    }

    const _app = new sst.aws.StaticSite("Frontend", {
      path: "app/",
      build: {
        output: "dist",
        command: "npm run build",
      },
      environment: {
        VITE_API_URL: api.url,
      },
    });
  }
});
