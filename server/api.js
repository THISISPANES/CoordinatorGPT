const express = require("express");
const { google } = require("googleapis");
const router = express.Router();

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

module.exports = router;
