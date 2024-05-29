// api.js
const express = require('express');
const { google } = require('googleapis');

const apiRouter = express.Router();

apiRouter.get('/classes', async (req, res) => {
    const auth = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );

    auth.setCredentials({
        access_token: req.session.access_token,
        refresh_token: req.session.refresh_token,
    });

    const classroom = google.classroom({ version: 'v1', auth });

    try {
        const response = await classroom.courses.list();
        res.json(response.data.courses);
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).send('Error fetching classes');
    }
});

module.exports = apiRouter;
