# Smooch-Slack Dispatcher

This is code for a Slack bot that can be used to dispatch custom alerts to a specified channel based on the content of Smooch messages.

Example uses are:
- Listening to specific phrases from Smooch appUsers
- Alerting agents that a bot is ready to hand the conversation off to a human

For an in-depth tutorial skip down to [Tutorial](#tutorial).

## Local setup

* Clone the repository

* Run `npm i` in the smooch-slack-dispatch directory

* Create a _.env_ file and provide the required [environment variables](#environment-variables)

* Run `npm start` to start the service

* Use a service like ngrok.io to expose endpoint for webhook events

* Configure the events array at the top of the _events.js_ file.

## Deployment

### Deploy to Heroku

Set environment variables for Heroku app and push whole repository to Heroku.

### Deploy to AWS Lambda

Copy the entire contents of _events.js_ as a AWS Lambda function, set environment variables in AWS Lambda config, and expose the function as an open AWS Lambda API Gateway endpoint.

## Environment Variables

Smooch-Slack dispatch requires that you configure a few environment variables.

| Variable                | Description |
|-------------------------|-------------|
| **VERIFICATION_TOKEN** `optional` | A secret token sent by slack with Webhook events to secure your event endpoint. Can be omitted for testing, but endpoint will be insecure. |
| **ACCESS_TOKEN** `required`       | A token for calling the Slack API. |
| **DISPATCH_CHANNEL_ID** `required` | The canonical ID for the Slack channel where dispatch messages should be sent. |
| **CLIENT_ID** `required for setup`       | Client ID for Slack app, used in Oauth process. |
| **CLIENT_SECRET** `required for setup` | Client secret for Slack app, used in Oauth process. |

## Tutorial

Prerequisites
- A [Smooch account](https://smooch.io/)
- A Slack team connected to your Smooch account. See [this guide](https://docs.smooch.io/guide/business-quickstart/) on setting up Smooch.

### Step 1 - local set up:

Clone this repository, `npm install` dependencies, and create an empty _.env_ file.

Install and run [ngrok](https://ngrok.com/), or use some other tools that can expose a local server to the Web.

Expose port 8000 for Web traffic `ngrok http 8000`, and start Smooch-Slack Dispatcher with `npm start`. You should now have a service listening on port 8000, and exposed to traffic.

### Step 2 - create and configure a Slack app:

Navigate to https://api.slack.com/apps and create a new app.


<img alt="Create a new Slack app" src="images/new-slack-app.png" style="max-width:300px;" />

Now, on your new app's dashboard, navigate down to _Event Subscriptions_ and enter your ngrok url followed by a /events route in the _Request URL_ field.

Below that, hit the _Add Team Event_ button, select _message.channels_ and save changes.

<img alt="Add subscription event" src="images/add-subscription-event.png" style="max-width:300px;" />

Still in our Slack app's dashboard, navigate up to _Basic Information_ and copy all of the keys into your _.env_ file, using _.env.example_ as a guide.

The contents of your _.env_ file should now look something like this:

```
VERIFICATION_TOKEN="HOwBOk5mRP2dVimpV&Bgv6Im9"
CLIENT_ID="144583240868.1393840943209"
CLIENT_SECRET="b5e0d42334b2d52c79l5os76e4f7606"
ACCESS_TOKEN=""
DISPATCH_CHANNEL_ID=""
```

### Step 3 - authorize the app to your Slack team

Now, restart your server so that the environment variables are available, and navigate down to _Oauth & Permissions_. Here we're going to add our service URL at the /redirect route.

<img alt="Redirect URL" src="images/oauth-redirect-url.png" style="max-width:300px;" />

In your browser visit localhost:8000/auth to add the app to your Slack team.

Once you complete the Oauth process, go visit your terminal once again. There you'll find something like this:

```
OAUTH ACCESS { ok: true,
  access_token: 'xoxp-18974539874-20938543-1023450954390534-8f26888a9aeeac27bd2f5ed89becb5e9',
  scope: 'identify,incoming-webhook,channels:history',
  user_id: 'U47PFALE4',
  team_name: 'Stasi from Smooch',
  team_id: 'S48J4QQPJ',
  incoming_webhook:
   { channel: '#general',
     channel_id: 'C46MX3VAQ',
     configuration_url: 'https://smooch-dispatch.slack.com/services/B491XPR1T',
     url: 'https://hooks.slack.com/services/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' } }
```

Grab the values of `access_token` and `channel_id` and add them to your .env file as ACCESS_TOKEN and DISPATCH_CHANNEL_ID. Your .env file should now look like this:

```
VERIFICATION_TOKEN="HOwBOk5mRP2dVimpV&Bgv6Im9"
CLIENT_ID="144583240868.1393840943209"
CLIENT_SECRET="b5e0d42334b2d52c79l5os76e4f7606"
ACCESS_TOKEN="xoxp-18974539874-20938543-1023450954390534-8f26888a9aeeac27bd2f5ed89becb5e9"
DISPATCH_CHANNEL_ID="C46MX3VAQ"
```

Restart your server so that the environment variables are available, and start a conversation between a user and your help desk on slack. If the user sends their email address as a message, you'll receive a notification in the dispatch channel.

<img alt="example dispatch message" src="images/example-dispatch.png" style="max-width:300px;" />

To adjust the triggers and alerts, edit the `events` array in _events.js_.
