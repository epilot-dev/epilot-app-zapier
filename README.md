<h1 align="center"><a href="https://marketplace.epilot.cloud/en/apps/zapier"><img src="./zapier.png" alt="zapier logo" width="100"><br>Zapier App for epilot</a></h1>

<p align="center">
  <a href="https://marketplace.epilot.cloud/en/apps/zapier">epilot Marketplace</a> •
  <a href="https://docs.epilot.io/docs/integrations/zapier">Zapier Integration Docs</a> •
  <a href="https://docs.epilot.io/apps/">Apps Developer Docs</a>
</p>

## Prerequisites

To run or deploy this app, you need:

- **AWS access** with permissions to deploy SST apps (Lambda, DynamoDB, API Gateway, CloudFormation)
- An [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) profile configured with credentials
- Node.js (>=18) and npm

## Quick Start

```bash
git clone https://github.com/epilot-dev/epilot-app-zapier.git
cd epilot-app-zapier
npm i
npm run dev
```

## Project Overview

This repository contains the Zapier App integration for epilot XRM, enabling 7,000+ Zapier workflows to connect with your epilot data.

This app uses the [@epilot/app-sdk](https://www.npmjs.com/package/@epilot/app-sdk) to interface with the epilot App Platform.

## Project Structure

- api/           SST backend (Lambda functions, DynamoDB, OpenAPI spec)
- app/           App Frontend (epilot App Bridge)
- openapi.yml    API specification
- sst.config.ts  SST configuration
- package.json   Workspace dependencies & scripts

## Development Commands

- npm run openapi   Generate API types from openapi.yml
- npm run dev       Start local dev (SST + live Lambda)
- npm run build     Build the SST app
- npm run deploy    Deploy to AWS
- npm run remove    Remove the deployed stack
- npm run console   Open AWS Console in default browser

## Resources

- Marketplace: https://marketplace.epilot.cloud/en/apps/zapier
- Zapier Integration Docs: https://docs.epilot.io/docs/integrations/zapier
- Apps Developer Docs: https://docs.epilot.io/apps/
- Developer Portal: https://docs.epilot.io
- SST Documentation: https://docs.sst.dev
