require('dotenv').config();

const https = require('https');
const qs = require('querystring');
const express = require('express');
const bodyParser = require('body-parser');
const events = require('./events');

const port = process.env.PORT || 8000;

express()
    .use(bodyParser.json())
    .get('/auth', (req, res) => res.sendFile(__dirname + '/public/auth.html'))
    .get('/redirect', (req, res) => {
        https.get('https://slack.com/api/oauth.access?' + qs.stringify({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: req.query.code
        }), response => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => console.log('OAUTH ACCESS', JSON.parse(data)));
            res.end();
        }).on('error', err => {
            console.log('OAUTH ACCESS ERROR', err);
            res.end();
        });
    })
    .post('/events', (req, res, next) => {
        const cb = (err, data) => err ? next(err) : res.send(data);
        events.handler(req.body, null, cb);
    })
    .use((err, req, res, next) => {
        console.log(err);
        res.status(500).send(err.message);
    })
    .listen(port, () => console.log(`Listening on ${port}`));
