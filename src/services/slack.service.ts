import { App as SlackApp, ExpressReceiver } from "@slack/bolt";
import type OllamaService from "./ollama.service";
import type { OllamaResponse } from "./ollama.service";
import type JiraService from "./jira.service";

export interface SlackConfig {
  botToken: string;
  signingSecret: string;
  endpoints: string;
  port: number;
}

export default class SlackService {
  private jiraService: JiraService;
  private ollamaService: OllamaService;
  private slackApp: SlackApp;
  private config: SlackConfig;

  constructor(
    config: SlackConfig,
    jiraService: JiraService,
    ollamaService: OllamaService
  ) {
    this.config = config;
    this.jiraService = jiraService;
    this.ollamaService = ollamaService;

    const receiver = new ExpressReceiver({
      signingSecret: this.config.signingSecret,
      endpoints: this.config.endpoints,
    });

    this.slackApp = new SlackApp({
      token: this.config.botToken,
      receiver,
    });

    this.setupHandlers();
  }

  async start() {
    await this.slackApp.start(this.config.port);
  }

  async setupHandlers() {
    this.slackApp.event(
      "app_mention",
      async ({ event, say }: { event: any; say: any }) => {
        if ("text" in event) {
          const text = event.text.toLowerCase();
          console.log(`Message received: ${text}`);

          if (text.includes("create jira ticket")) {
            await say("Creating a Jira ticket... 🚀");
          } else if (text.includes("status update")) {
            await say("Here is your status update. 📊");
          }
        }
      }
    );

    this.slackApp.event(
      "message",
      async ({ event, say }: { event: any; say: any }) => {
        // Avoid bot echo (don't respond to your own messages)
        if (event.subtype === "bot_message") return;

        const text = (event as any).text;
        const user = (event as any).user;
        const channel = (event as any).channel;

        console.log(`Message from user ${user} in channel ${channel}: ${text}`);

        try {
          const parsed: OllamaResponse = await this.ollamaService.queryOllama(
            text
          );
          console.log(JSON.stringify({ parsed }));

          switch (parsed.intent) {
            case "create_ticket":
              await this.jiraService.createTicket({
                summary: parsed.summary,
                projectKey: "SCRUM",
              });
              await say(`✅ Ticket created: ${parsed.summary}`);
              break;
            default:
              await say(
                "🤔 I couldn't understand that. Try 'create Jira ticket' or 'status update'."
              );
          }
        } catch (error) {
          console.error("Error processing message:", error);
          await say(
            "Sorry, I encountered an error processing your message. Please try again."
          );
        }
      }
    );
  }
}
