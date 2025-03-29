export interface CreateTicketParams {
  summary: string;
  projectKey: string;
}

export interface JiraConfig {
  email: string;
  apiToken: string;
  domain: string;
}

export default class JiraService {
  private auth: string;
  private config: JiraConfig;

  constructor(config: JiraConfig) {
    this.config = config;
    this.auth = Buffer.from(
      `${this.config.email}:${this.config.apiToken}`
    ).toString("base64");
  }

  async createTicket({ summary, projectKey }: CreateTicketParams) {
    const body = {
      fields: {
        project: { key: projectKey },
        summary,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: `text=${summary}`,
                },
              ],
            },
          ],
        },
        issuetype: { name: "Task" },
      },
    };
    const response = await this.sendMessageToJira(body);

    return response;
  }

  async sendMessageToJira(body: any) {
    const url = `https://${this.config.domain}/rest/api/3/issue`;
    const fetchConfig = {
      method: "POST",
      headers: {
        Authorization: `Basic ${this.auth}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    };
    const response = await fetch(url, fetchConfig);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Jira error: ${response.status} — ${error}`);
    }

    return response.json();
  }
}
