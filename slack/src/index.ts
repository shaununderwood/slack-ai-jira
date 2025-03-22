import { App, ExpressReceiver } from '@slack/bolt';
import dotenv from 'dotenv';

dotenv.config();

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  endpoints: '/slack/events',
});

receiver.router.post('/slack/events', (req, res) => {
  if (req.body?.type === 'url_verification') {
    return res.send(req.body.challenge);
  }
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
});

app.event('app_mention', async ({ event, say }) => {
  if ('text' in event) {
    const text = event.text.toLowerCase();
    console.log(`Message received: ${text}`);

    if (text.includes('create jira ticket')) {
      await say('Creating a Jira ticket... 🚀');
    } else if (text.includes('status update')) {
      await say('Here is your status update. 📊');
    }

    // how 
  }
});

app.event('message', async ({ event, say }) => {
  // Avoid bot echo (don’t respond to your own messages)
  if (event.subtype === 'bot_message') return;

  const text = (event as any).text;
  const user = (event as any).user;
  const channel = (event as any).channel;

  console.log(`Message from user ${user} in channel ${channel}: ${text}`);

  if (text.includes('create jira ticket')) {
    await say(`Got it, <@${user}>! Creating a Jira ticket... 🛠️`);
  } else if (text.includes('status update')) {
    await say(`Sure, <@${user}>! Here's your status update: 📊 All systems go.`);
  }
});

(async () => {
  await app.start(Number(process.env.PORT) || 3000);
  console.log('⚡️ Slack bot is running!');
})();