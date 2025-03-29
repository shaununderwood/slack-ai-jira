import { config } from './config';
import SlackService from './services/slack.service';
import JiraService from './services/jira.service';

const jiraService = new JiraService(config.jira);
const slackService = new SlackService(config.slack, jiraService);

// Start the app
(async () => {
  await slackService.start();
  console.log("⚡️ Slack bot is running!");
})();
