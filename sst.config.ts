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
    const api = new sst.aws.ApiGatewayV2("ZapierApi", {
//      domain: "api.example.com",
    });

    api.route("ANY /{proxy+}", {
      handler: "src/index.handler",
      runtime: "nodejs22.x",
      architecture: 'arm64',
    });
  }
});
