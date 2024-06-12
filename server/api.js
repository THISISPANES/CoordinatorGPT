const express = require("express");
const { google } = require("googleapis");
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '632513860763-fd7ofvc6ul9ucr5sh3ai8uak7c9jqa6u.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

async function getCourses(accessToken) {
  const classroom = google.classroom({ version: "v1", auth: accessToken });
  const res = await classroom.courses.list();
  return res.data.courses;
}

router.get("/courses", async (req, res) => {
  try {
    const courses = await getCourses(req.session.access_token);
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).send("Error fetching courses");
  }
});

// Route to get assignments
router.get("/assignments", (req, res) => {
  res.json(assignments);
});

// Route to get user data
router.get('/user', (req, res) => {
  if (req.session.isAuthenticated) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

router.post('/login', async (req, res) => {
  const { id_token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];

  // Create a session for the user
  req.session.user = userid;

  res.json({ message: 'Logged in' });
});

module.exports = router;
