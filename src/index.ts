import { config } from './config';
import { app, setupSlackHandlers } from './handlers/slack';

// Set up Slack event handlers
setupSlackHandlers();

// Start the app
(async () => {
  await app.start(config.slack.port);
  console.log("⚡️ Slack bot is running!");
})();
