import { config } from './config';
import { setupSlackHandlers, slackApp } from './handlers/slack';
import JiraService from './services/jira.service';

const jiraService = new JiraService(config.jira);
setupSlackHandlers(jiraService);

// Start the app
(async () => {
  await slackApp.start(config.slack.port);
  console.log("⚡️ Slack bot is running!");
})();
