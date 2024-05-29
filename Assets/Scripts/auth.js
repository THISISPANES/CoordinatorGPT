const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const bodyParser = require('body-parser');


const CLIENT_ID = '632513860763-fd7ofvc6ul9ucr5sh3ai8uak7c9jqa6u.apps.googleusercontent.com'; // Replace with your actual CLIENT_ID
const client = new OAuth2Client(CLIENT_ID);


const authRouter = express.Router();


authRouter.use(bodyParser.json());


authRouter.post('/verifyToken', async (req, res) => {
    const { idToken } = req.body;


    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: CLIENT_ID, // Ensure the token is intended for your application
        });
        const payload = ticket.getPayload();
        const userId = payload.sub;
        const email = payload.email;
        // You can perform further actions here, such as creating a user session
        res.status(200).send({ userId, email });
    } catch (error) {
        console.error('Error verifying ID token:', error);
        res.status(401).send('Unauthorized');
    }
});


module.exports = authRouter;
