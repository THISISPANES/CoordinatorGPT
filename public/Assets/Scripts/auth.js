// auth.js
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const client = new OAuth2Client(CLIENT_ID);

const authRouter = express.Router();

authRouter.post('/auth/google/callback', async (req, res) => {
    const id_token = req.body.id_token;

    try {
        const { tokens } = await client.getToken({
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
        });

        req.session.access_token = ticket.getPayload().at_hash;
        req.session.refresh_token = ticket.getPayload().at_hash;

        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();
        req.session.user = {
            id: payload.sub,
            email: payload.email,
        };

        res.redirect('/page2');
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Authentication failed');
    }
});

module.exports = authRouter;
