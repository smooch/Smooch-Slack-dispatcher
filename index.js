require('dotenv').config();

const fs = require('fs');
const https = require('https');
const qs = require('querystring');
const express = require('express');
const bodyParser = require('body-parser');
const events = require('./events');
const ejs = require('ejs');
const authEjs = fs.readFileSync(__dirname + '/auth-template.ejs.html', 'utf-8');
const authHtml = ejs.render(authEjs, { clientId: process.env.CLIENT_ID });

const port = process.env.PORT || 8000;

express()
    .use(bodyParser.json())
    .get('/auth', (req, res) => res.send(authHtml))
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
