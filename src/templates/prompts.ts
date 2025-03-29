import { PromptBuilder } from "./promptBuilder";

export const intentClassifier = new PromptBuilder({
  system: "You are an AI assistant integrated into a Slack bot that can take actions based on messages.",
  user: "Message: \"{message}\"",
  format: `Respond with JSON only. No text before or after, in this exact format:
{
  "intent": "create_ticket" | "status_update" | "unknown",
  "summary": "Short summary of task",
  "ticket": "the ticket's id, if one is found"
}`
});
