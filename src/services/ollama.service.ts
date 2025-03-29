import { intentClassifier } from "../templates/prompts";

export interface OllamaResponse {
  intent: "create_ticket" | "status_update" | "unknown";
  summary: string;
  ticket?: string;
}

export interface OllamaServiceConfig {
  baseUrl: string;
  model: string;
}

export default class OllamaService {
  private config: OllamaServiceConfig;

  constructor(config: OllamaServiceConfig) {
    this.config = config;
  }

  queryOllama = async (message: string): Promise<OllamaResponse> => {
    const prompt = intentClassifier.build({ message });
    console.log(`Prompt: ${prompt}`);

    const url = `${this.config.baseUrl}/api/generate`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.config.model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama returned error: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.response) as OllamaResponse;
  };
}
