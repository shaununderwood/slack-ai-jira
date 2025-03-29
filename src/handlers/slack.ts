import { App as SlackApp, ExpressReceiver } from "@slack/bolt";
import { config } from '../config';
import { queryOllama, OllamaResponse } from '../services/ollama';
import JiraService from '../services/jira.service';

export const receiver = new ExpressReceiver({
  signingSecret: config.slack.signingSecret,
  endpoints: "/slack/events",
});

export const slackApp = new SlackApp({
  token: config.slack.botToken,
  receiver,
});

export function setupSlackHandlers(jiraService: JiraService) {
  slackApp.event("app_mention", async ({ event, say }: { event: any, say: any }) => {
    if ("text" in event) {
      const text = event.text.toLowerCase();
      console.log(`Message received: ${text}`);

      if (text.includes("create jira ticket")) {
        await say("Creating a Jira ticket... 🚀");
      } else if (text.includes("status update")) {
        await say("Here is your status update. 📊");
      }
    }
  });

  slackApp.event("message", async ({ event, say }: { event: any, say: any }) => {
    // Avoid bot echo (don't respond to your own messages)
    if (event.subtype === "bot_message") return;

    const text = (event as any).text;
    const user = (event as any).user;
    const channel = (event as any).channel;

    console.log(`Message from user ${user} in channel ${channel}: ${text}`);

    try {
      const parsed: OllamaResponse = await queryOllama(text);
      console.log(JSON.stringify({ parsed }));

      switch (parsed.intent) {
        case "create_ticket":
          await jiraService.createTicket({ summary: parsed.summary, projectKey: 'SCRUM' });
          await say(`✅ Ticket created: ${parsed.summary}`);
          break;
        default:
          await say(
            "🤔 I couldn't understand that. Try 'create Jira ticket' or 'status update'."
          );
      }
    } catch (error) {
      console.error('Error processing message:', error);
      await say("Sorry, I encountered an error processing your message. Please try again.");
    }
  });
} 