// app.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const authRouter = require('./auth');
const apiRouter = require('./api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Assets')));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

function isAuthenticated(req,
