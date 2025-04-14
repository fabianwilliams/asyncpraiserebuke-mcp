#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
// @ts-expect-error: Temporary until types are available for this module
import { registerOpenApiTool } from '@modelcontextprotocol/sdk';


import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const server = new McpServer({
  name: 'PublicReviewsMCP',
  version: '1.0.0',
  description: 'MCP tools for accessing public review data and trends',
});

await registerOpenApiTool({
  name: 'reviewsApi',
  server,
  manifest: JSON.parse(fs.readFileSync('./reviews.openapi.json', 'utf-8')),
  proxy: {
    baseUrl: process.env.REVIEW_API_BASE_URL!,
    rewriteRequest: (req: any) => {
      req.headers['X-API-Key'] = process.env.REVIEW_API_KEY!;
      return req;
    },
    methodMappings: {
      listPublicReviews: 'post',
      getTopRatedLocations: 'post',
      searchReviews: 'post'
    }
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
