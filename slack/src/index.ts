import { App, ExpressReceiver } from "@slack/bolt";
import dotenv from "dotenv";

dotenv.config();

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  endpoints: "/slack/events",
});

receiver.router.post("/slack/events", (req, res) => {
  if (req.body?.type === "url_verification") {
    return res.send(req.body.challenge);
  }
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
});

app.event("app_mention", async ({ event, say }) => {
  if ("text" in event) {
    const text = event.text.toLowerCase();
    console.log(`Message received: ${text}`);

    if (text.includes("create jira ticket")) {
      await say("Creating a Jira ticket... 🚀");
    } else if (text.includes("status update")) {
      await say("Here is your status update. 📊");
    }

    // how
  }
});

app.event("message", async ({ event, say }) => {
  // Avoid bot echo (don’t respond to your own messages)
  if (event.subtype === "bot_message") return;

  const text = (event as any).text;
  const user = (event as any).user;
  const channel = (event as any).channel;

  console.log(`Message from user ${user} in channel ${channel}: ${text}`);

  const parsed = JSON.parse(await queryOllama(text));

  console.log(JSON.stringify({ parsed }));
  await say(`parsed: ${JSON.stringify({ parsed })}`);

  switch (parsed.intent) {
    case "create_ticket":
      await createJiraTicket({ summary: parsed.summary , projectKey: 'SCRUM' });
      await say(`✅ Ticket created: ${parsed.summary}`);
      break;
    case "status_update":
      const status = await getStatusUpdate(parsed.details);
      await say(`📊 Status: ${status}`);
      break;
    default:
      await say(
        "🤔 I couldn't understand that. Try 'create Jira ticket' or 'status update'."
      );
  }
});
async function getStatusUpdate(instructions: any) {
  console.log({ getStatusUpdate: instructions });
}
export async function queryOllama(message: string) {
  const prompt = `You are an AI assistant integrated into a Slack bot that can take actions based on messages.
  Respond with JSON only. No text before or after. Given the message below, return an object describing the user's intent.
  
  Message: "${message}"
  
  Respond in this exact format:
  {
    "intent": "create_ticket" | "status_update" | "unknown",
    "summary": "Short summary of task",
    "ticket": "the ticket's id, if one is found"
  }`;
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2", // or whatever you've pulled via `ollama pull`
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama returned error: ${response.status}`);
  }

  const data = await response.json();
  return data.response; // this is a string (the LLM's full response)
}

export async function createJiraTicket({
  summary,
  projectKey,
}: {
  summary: string;
  projectKey: string;
}) {
  const auth = Buffer.from(
    `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
  ).toString("base64");

  const body = JSON.stringify({
    fields: {
      project: { key: projectKey },
      summary,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `text=${summary}`
              }
            ]
          }
        ]
      },
      issuetype: { name: 'Task' }
    }
  })

  console.log({ body })
  const response = await fetch(
    `https://${process.env.JIRA_DOMAIN}/rest/api/3/issue`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Jira error: ${response.status} — ${error}`);
  }

  const data = await response.json();
  return data;
}

(async () => {
  await app.start(Number(process.env.PORT) || 3000);
  console.log("⚡️ Slack bot is running!");
})();
