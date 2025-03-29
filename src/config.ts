import dotenv from "dotenv";

dotenv.config();

export const config = {
  slack: {
    signingSecret: process.env.SLACK_SIGNING_SECRET || '',
    botToken: process.env.SLACK_BOT_TOKEN || '',
    port: Number(process.env.PORT) || 3000,
    endpoints: process.env.SLACK_ENDPOINTS || '/slack/events',
  },
  jira: {
    email: process.env.JIRA_EMAIL || '',
    apiToken: process.env.JIRA_API_TOKEN || '',
    domain: process.env.JIRA_DOMAIN || '',
  },
  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || '',
  }
} as const; 