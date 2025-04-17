#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { spawnSync } from 'child_process';


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

// Tool 6: Agent discovery and logging of business emails
// This tool uses ClicknContact to discover business emails and logs them to the directory
server.tool(
  'discoverAndLogBusinessEmail',
  'Discover contact emails via ClicknContact and log new entries to the directory',
  {
    websiteUrls: z.array(z.string()).describe("List of business website URLs to scan"),
  },
  async ({ websiteUrls }) => {
    const inputJson = JSON.stringify({ websiteUrls });

    console.log('📡 Invoking ClicknContact to discover business emails...');

    const result = spawnSync('npx', ['-y', '@fabianwilliams/clickncontact'], {
      input: inputJson,
      encoding: 'utf-8',
      shell: true,
    });

    if (result.error) {
      return {
        content: [
          { type: 'text', text: `❌ Error invoking ClicknContact: ${result.error.message}` },
        ],
      };
    }

    const raw = result.stdout;
    let discovered = [];

    try {
      discovered = JSON.parse(raw);
    } catch (e) {
      return {
        content: [
          { type: 'text', text: `❌ Failed to parse ClicknContact output.\n\nRaw:\n${raw}` },
        ],
      };
    }

    const results = [];

    for (const item of discovered) {
      const email = item.best?.toLowerCase();
      const url = item.url;

      if (!email) {
        results.push({ url, status: 'No valid email discovered' });
        continue;
      }

      const exists = await searchBusinessDirectory(url);
      const match = exists?.find(e => e.email?.toLowerCase() === email);

      if (match) {
        results.push({ url, email, status: 'Already logged' });
      } else {
        const logResult = await logBusinessEmail({
          establishmentName: url,
          email,
          address: 'Unknown',
          phone: 'Unknown',
        });

        results.push({ url, email, status: 'Logged', logResult });
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(results, null, 2),
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
