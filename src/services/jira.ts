import { config } from '../config';

interface CreateTicketParams {
  summary: string;
  projectKey: string;
}

export async function createJiraTicket({ summary, projectKey }: CreateTicketParams) {
  const auth = Buffer.from(
    `${config.jira.email}:${config.jira.apiToken}`
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
  });

  const response = await fetch(
    `https://${config.jira.domain}/rest/api/3/issue`,
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

  return response.json();
} 