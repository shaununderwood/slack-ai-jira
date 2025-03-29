import { config } from './config';
import SlackService from './services/slack.service';
import JiraService from './services/jira.service';
import OllamaService from './services/ollama.service';

const jiraService = new JiraService(config.jira);
const ollamaService = new OllamaService(config.ollama);
const slackService = new SlackService(config.slack, jiraService, ollamaService);

// Start the app
await slackService.start();
console.log("⚡️ Slack bot is running!");
