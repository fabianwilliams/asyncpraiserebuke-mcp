import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { fetchReviews, fetchTopRated, searchReviews } from './apiClient.js';

const server = new McpServer({
  name: 'AsyncPraiseRebuke',
  version: '1.0.6',
});

// Tool: List public reviews
server.tool(
  'listPublicReviews',
  'Get all available public feedback reviews',
  {},
  async () => {
    const data = await fetchReviews();
    return {
      content: [
        {
          type: 'json',
          mimeType: 'application/json',
          json: data,
        },
      ],
    } as any;
  },
);

// Tool: Get top rated
server.tool(
  'getTopRatedLocations',
  'Return top and lowest rated feedback locations',
  {},
  async () => {
    const data = await fetchTopRated();
    return {
      content: [
        {
          type: 'json',
          mimeType: 'application/json',
          json: data,
        },
      ],
    } as any;
  },
);

// Tool: Search by place name
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
          type: 'json',
          mimeType: 'application/json',
          json: data,
        },
      ],
    } as any;
  },
);

// Boot MCP server
const transport = new StdioServerTransport();
await server.connect(transport);
