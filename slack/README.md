# Slack AI Jira Bot

This is a Slack bot that integrates with Jira. The bot listens for specific messages in Slack, logs them to the console, and replies to predefined requests. Ideal for teams who want simple AI-assisted Jira interactions within Slack.

## Features

- Connects to your Slack workspace
- Listens for messages directed at the bot
- Logs messages to the console
- Sends responses to specific triggers (e.g. "create Jira ticket", "status update")

## Getting Started

### Connects to your Slack workspace
1. visit https://api.slack.com/apps
2. click `Create New App`, then `create from scratch`
3. Enter `App name` and pick a `workspace`
4. On `Socket Mode` disable `Event Socket Mode`
5. Visit `Event Subscriptions` and `Enable Events`
6. Run ngrok and copy the URL: eg `https://6577-83-167-185-48.ngrok-free.app/slack/events`
7. Enter ngrok URL to `Request URL`
8. Visit `OAuth & Permissions`, `OAuth Tokens`
9. Click 

#### Setup env
1. Visit `Basic Information`
2. Copy `Client Id`

#### Setup Slack event subscription
3. for production reasons
4. 
5. 
6. Add the URL to `Request URL` in Slack
7. Click Check


### Prerequisites

- Node.js (v16+ recommended)
- A Slack App and Bot Token
- (Optional) Jira API credentials if integrating with Jira

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/slack-ai-jira.git
   cd slack-ai-jira

