require('dotenv').config();

const express = require('express')
const bodyParser = require('body-parser')
const events = require('./events');

const port = process.env.PORT || 8000;

express()
    .use(bodyParser.json())
    .post('/events', (req, res, next) => {
        const cb = (err, data) => err ? next(err) : res.send(data);
        events.handler(req.body, null, cb);
    })
    .use((err, req, res, next) => {
        console.log(err);
        res.status(500).send(err.message);
    })
    .listen(port, () => console.log(`Listening on ${port}`));
