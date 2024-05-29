const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const client = new OAuth2Client(CLIENT_ID);

const authRouter = express.Router();

authRouter.use(bodyParser.json());

authRouter.get('/auth/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
        });

        const { id_token } = response.data;

        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const userId = payload.sub;
        const email = payload.email;

        // Redirect to the frontend page with user data
        res.redirect(`https://coordinator-gpt.vercel.app/example?userId=${userId}&email=${email}`);
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Authentication failed');
    }
});

module.exports = authRouter;
