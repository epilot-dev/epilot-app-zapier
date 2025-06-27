<h1 align="center"><a href="https://marketplace.epilot.cloud/en/apps/zapier"><img alt="epilot-logo" src="./logo.png" width="200"><br>Zapier App for epilot</a></h1>

<p align="center">
  <a href="https://marketplace.epilot.cloud/en/apps/zapier">Marketplace</a> •
  <a href="https://docs.epilot.io/docs/integrations/zapier">Zapier Integration Docs</a> •
  <a href="https://docs.epilot.io/apps/">Apps Developer Docs</a>
</p>

## Quick Start

```bash
git clone <repository-url>
cd epilot-app-zapier
npm install
npx sst dev
```

## Project Overview

This repository contains the Zapier App integration for epilot XRM, enabling 7,000+ Zapier workflows to connect with your epilot data.

This app uses the [@epilot/app-sdk](https://www.npmjs.com/package/@epilot/app-sdk) to interface with the epilot App Platform.

## Project Structure

- api/           SST backend (Lambda functions, DynamoDB, OpenAPI spec)
- app/           Frontend (if any)
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
