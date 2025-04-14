#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  fetchReviews,
  fetchTopRated,
  searchReviews,
  logBusinessEmail,
  searchBusinessDirectory,
} from './apiClient.js';


const server = new McpServer({
  name: 'AsyncPraiseRebuke',
  version: '1.0.6',
});

// Tool 1: List public reviews
server.tool(
  'listPublicReviews',
  'Get all available public feedback reviews',
  {},
  async () => {
    const data = await fetchReviews();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  },
);

// Tool 2: Top rated/lowest rated
server.tool(
  'getTopRatedLocations',
  'Return top and lowest rated feedback locations',
  {},
  async () => {
    const data = await fetchTopRated();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  },
);

// Tool 3: Search by name
server.tool(
  'searchReviews',
  'Search for reviews by partial or full business name',
  {
    place: z.string().describe('Business name to search for'),
  },
  async ({ place }) => {
    const data = await searchReviews(place);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  },
);

// Tool 4: Search for an establishment in the business directory
server.tool(
  'searchBusinessDirectory',
  'Search for a business email by establishment name',
  {
    name: z.string().describe("Name of the business to search for"),
  },
  async ({ name }) => {
    const result = await searchBusinessDirectory(name);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

// Tool 5: Log a new business email (no validation required yet)
server.tool(
  'logBusinessEmail',
  'Submit a new business email discovered by an agent or a user',
  {
    establishmentName: z.string().describe("The business name"),
    email: z.string().email().describe("Email address for the business"),
    address: z.string().describe("Business address"),
    phone: z.string().describe("Phone number of the business"),
  },
  async (input) => {
    const result = await logBusinessEmail(input);
    return {
      content: [
        {
          type: 'text',
          text: result,
        },
      ],
    };
  }
);

// MCP bootstrap
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('Fatal error starting AsyncPraiseRebuke MCP server:', err);
  process.exit(1);
});
