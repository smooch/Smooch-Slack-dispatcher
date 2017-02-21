# Smooch-Slack Dispatcher

This is code for a Slack bot that can be used to dispatch custom alerts to a specified channel based on the content of Smooch messages.

Example uses are:
- Listening to specific phrases from Smooch appUsers
- Alerting agents that a bot is ready to hand the conversation off to a human

## Local setup

* Clone the repository

* Run `npm i` in the smooch-slack-dispatch directory

* Perform the necessary [Slack setup](#slack-setup)

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
| **VERIFICATION_TOKEN**  | A secret token sent by slack with Webhook events to secure your event endpoint. The token can be acquired by logging an event payload, or during setup of the [Slack app](https://api.slack.com/apps). Can be omitted for testing, but endpoint will be insecure. |
| **ACCESS_TOKEN**        | A token for calling the Slack API, which can be acquired using the Slack [oauth.access method](https://api.slack.com/methods/oauth.access), or through the [test token interface](https://api.slack.com/docs/oauth-test-tokens). |
| **DISPATCH_CHANNEL_ID** | The canonical ID for the Slack channel where dispatch messages should be sent. Can be acquired using the [channels.list method](https://api.slack.com/methods/channels.list). |

## Slack Setup

TODO
