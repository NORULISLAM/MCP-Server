import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import { google } from "googleapis";
import { z } from "zod";

dotenv.config();

// This project exposes a small calendar tool through MCP.
const automationServer = new McpServer({
    name: "Sample service",
    version: "1.0.0",
});

async function fetchCalendarEventsForDate(inputDate) {
    const calendarClient = google.calendar({
        version: "v3",
        auth: process.env.GOOGLE_PUBLIC_API_KEY,
    });

    // Build an exact UTC day window so event filtering is predictable.
    const dayStartUtc = new Date(inputDate);
    dayStartUtc.setUTCHours(0, 0, 0, 0);
    const nextDayUtc = new Date(dayStartUtc);
    nextDayUtc.setUTCDate(nextDayUtc.getUTCDate() + 1);

    try {
        const response = await calendarClient.events.list({
            calendarId: process.env.CALENDAR_ID,
            timeMin: dayStartUtc.toISOString(),
            timeMax: nextDayUtc.toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: "startTime",
        });

        const eventItems = response.data.items ?? [];
        const events = eventItems.map((eventItem) => {
            const eventStart = eventItem.start?.dateTime || eventItem.start?.date;
            const eventTitle = eventItem.summary || "Untitled event";
            return `${eventTitle} at ${eventStart}`;
        });

        return { events };
    } catch (err) {
        return {
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}

automationServer.tool(
    "getCalendarEventsByDate",
    {
        date: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format. Please provide a valid date string.",
        }),
    },
    async ({ date }) => {
        const result = await fetchCalendarEventsForDate(date);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result),
                },
            ],
        };
    }
);

async function startService() {
    const transport = new StdioServerTransport();
    await automationServer.connect(transport);
}

startService();
