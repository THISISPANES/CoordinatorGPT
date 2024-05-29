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

apiRouter.get('/assignments', async (req, res) => {
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
        const coursesResponse = await classroom.courses.list();
        const courses = coursesResponse.data.courses;

        const assignments = await Promise.all(courses.map(async (course) => {
            const courseWorkResponse = await classroom.courses.courseWork.list({ courseId: course.id });
            return courseWorkResponse.data.courseWork.map(work => ({
                courseName: course.name,
                title: work.title,
                dueDate: work.dueDate,
                dueTime: work.dueTime
            }));
        }));

        res.json(assignments.flat());
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).send('Error fetching assignments');
    }
});

module.exports = apiRouter;
