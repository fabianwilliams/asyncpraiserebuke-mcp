# 🤖 AsyncPraiseRebuke MCP Server

**AsyncPraiseRebuke-MCP** is a [Model Context Protocol (MCP)](https://modelcontextprotocol.dev) server that exposes business feedback and contact discovery tools — including AI agent-based flows — for integration with Claude Desktop or any other MCP-compliant client.

## 🔍 What It Does

This server powers tools that can:

- ✅ List and search customer feedback reviews  
- ✅ View top-rated and lowest-rated establishments  
- ✅ Discover business contact emails using scraping and heuristics  
- ✅ Log new entries to a Cosmos DB-based directory  
- ✅ Chain tool logic with agents that automate multi-step flows  

## 🧩 Available Tools

### Core Tools (Stateless & Reusable)

These can be used individually for focused functionality:

- \`listPublicReviews\` – Get all public feedback entries  
- \`getTopRatedLocations\` – View top and bottom rated businesses  
- \`searchReviews\` – Search reviews by partial business name  
- \`searchBusinessDirectory\` – Look up existing business entries in Cosmos DB  
- \`logBusinessEmail\` – Add a business contact email manually  
- \`discoverBusinessEmail\` *(from ClicknContact)* – Discover emails and form fields from business websites  

### 🧠 Agent Tool: \`discoverAndLogBusinessEmail\`

This agentized tool automates the entire workflow:

1. Calls ClicknContact to discover contact info  
2. Checks your Cosmos DB directory to prevent duplicates  
3. Logs new businesses with placeholder values if needed  

**Tool name:** \`discoverAndLogBusinessEmail\`  
**Source:** \`ClicknContactScannerAgent\`  

---

## 🚀 Getting Started

```bash
npm install -g @fabianwilliams/asyncpraiserebuke-mcp
```

Then add to your Claude Desktop config:

```json
"ClicknContactScannerAgent": {
  "command": "npx",
  "args": [
    "--yes",
    "@fabianwilliams/asyncpraiserebuke-mcp",
    "scanAndLogNewBusinessEmails"
  ],
  "env": {
    "REVIEW_API_KEY": "your-key-here",
    "REVIEW_API_BASE_URL": "https://your-api.com/api"
  }
}
```

You can also run this manually:

```bash
npx --yes @fabianwilliams/asyncpraiserebuke-mcp scanAndLogNewBusinessEmails
```

---

## 🛠 Dev Structure

```plaintext
/src
  apiClient.ts       // Cosmos-backed endpoint calls
  main.ts            // MCP tool definitions
  types.ts           // Shared types
  scanAndLogNewBusinessEmails.ts // CLI agent wrapper

/test
  businessesToScan.json // Sample test data
```

---

## 🧪 Testing the Agent

Make sure dependencies are installed and build the project:

```bash
npm install
npm run build
```

Then run:

```bash
npx @fabianwilliams/asyncpraiserebuke-mcp scanAndLogNewBusinessEmails
```

Or test via Claude Desktop:

> Please scan the following websites for contact emails and log any new ones not already in the directory: https://example1.com, https://example2.com

---

## 📦 Publishing

For maintainers:

```bash
npm version patch  # or minor / major
npm publish --access public
```

---

## 🪪 License

MIT — use it, fork it, agentify it.

> Built with ❤️ by [@fabianwilliams](https://github.com/fabianwilliams)
