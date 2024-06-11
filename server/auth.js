const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '632513860763-fd7ofvc6ul9ucr5sh3ai8uak7c9jqa6u.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  return payload; // payload contains the user data
}

router.post('/google/callback', async (req, res) => {
  const token = req.body.id_token;
  const userData = await verify(token).catch(console.error);
  // userData contains the user's Google profile information
  // You can extract specific fields like this:
  const email = userData.email;
  const name = userData.name;
  const pictureUrl = userData.picture;
  // Now you can use this data in your application

  req.session.isAuthenticated = true;
  req.session.user = {
    email: email,
    name: name,
    pictureUrl: pictureUrl
  };
});

module.exports = router;