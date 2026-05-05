# MCP SERVER CONNECT WITH EXTENAL TOOL

## Overview
This project is a personal learning project built to understand how a small task automation service can expose useful tools to an AI client.

## Problem
Many daily scheduling checks are done by hand. That manual process wastes time and makes repeated lookups harder to scale.

## Solution
This project provides a lightweight MCP server that accepts a date input, queries a calendar source, and returns clean event output for automation workflows.

## Features
- Single MCP tool for date-based calendar lookup
- Input validation for safer tool usage
- Simple modular logic in one service entry point
- Environment-based configuration for local development

## Real-World Impact
- Saves time for repeated schedule checks
- Creates a clear base for building larger automation flows
- Helps Example user learn how AI tools can call an Internal module safely

## Tech Stack
- Node.js
- `@modelcontextprotocol/sdk`
- `googleapis`
- `zod`

## Getting Started
1. Install dependencies:
   - `npm install`
2. Create a `.env` file:
   - `GOOGLE_PUBLIC_API_KEY=...`
   - `CALENDAR_ID=...`
3. Start the service:
   - `npm start`

## Notes
This project is intentionally small and easy to read. It is designed as a step-by-step learning project by one developer.

## License
MIT
