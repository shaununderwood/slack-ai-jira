import { App, ExpressReceiver } from "@slack/bolt";
import { config } from '../config';
import { createJiraTicket } from '../services/jira';
import { queryOllama, OllamaResponse } from '../services/ollama';

export const receiver = new ExpressReceiver({
  signingSecret: config.slack.signingSecret,
  endpoints: "/slack/events",
});

export const app = new App({
  token: config.slack.botToken,
  receiver,
});

export function setupSlackHandlers() {
  app.event("app_mention", async ({ event, say }) => {
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

  app.event("message", async ({ event, say }) => {
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
          await createJiraTicket({ summary: parsed.summary, projectKey: 'SCRUM' });
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