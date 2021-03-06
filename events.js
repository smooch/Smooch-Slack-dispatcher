'use strict';

// Define trigger-alert pairs in `events`:
// The trigger value can be a regular expression or string.
// Optionally, you can define a `channel` key to an event,
// the value of which is a channel ID for the channel this alert should be
// dispatched to. the bot must be invited to each channel where alerts are
// to be dispatched.
const events = [
    {
        trigger:'Hold on, I\'ll go get a human',
        alert:'human agent alert'
    }, {
        trigger: /([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})/,
        alert: 'email in conversation alert'
    }
];

const https = require('https');
const qs = require('querystring');

const verificationToken = process.env.VERIFICATION_TOKEN;
const accessToken = process.env.ACCESS_TOKEN;
const defaultChannelId = process.env.DISPATCH_CHANNEL_ID;

exports.handler = (data, context, cb) => {
    if (verificationToken && data.token !== verificationToken) {
        // API call failed auth
        return cb(null, 'Bad token');
    }

    if (data.type === 'url_verification') {
        // API call is endpoint verification
        return cb(null, data.challenge);
    }

    if (!data.event.bot_id || data.type !== 'event_callback') {
        // API call is not an event triggered by a bot
        return cb(null, 'Not a bot event');;
    }

    // Check bot messages in public channels for trigger phrases,
    // then dispatch alerts

    const dispatchMessages = [];

    for (const attachment of data.event && data.event.attachments || []) {
        for (const pair of events) {
            if (RegExp(pair.trigger).test(attachment.pretext)) {
                dispatchMessages.push({
                  alert: pair.alert,
                  dispatchChannel: pair.channel || defaultChannelId,
                  eventChannel: data.event.channel,
                  context: attachment.pretext,
                });
            }
        }
    }

    if (dispatchMessages.length === 0) {
        return cb(null, 'No event triggers matched');
    }

    const requests = dispatchMessages.map(data => {
        return new Promise(resolve => {
            https.get('https://slack.com/api/chat.postMessage?' + qs.stringify({
                token: accessToken,
                channel: data.dispatchChannel,
                text: `${data.alert} in <#${data.eventChannel}>\n>>>${data.context}`
            }), () => resolve());
        });
    })

    Promise.all(requests).then(() => cb(null, 'Dispatched alerts'));
}
