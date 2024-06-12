// app.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const apiRouter = require('./api'); // Adjusted to require directly from the same folder
const authRouter = require('./auth'); // Adjusted to require directly from the same folder

const app = express();
const PORT = process.env.PORT || 3000;

app.use(session({ secret: 'your-session-secret', resave: false, saveUninitialized: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); // Adjusted to point to the public folder at the same level as the server folder
app.use(session({
    secret: '."W90N.{tM$+8k&jf7J.+vb)T@wu+f3n6]k4=&q',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // set to true if you're using https
}));

function isAuthenticated(req, res, next) {
    if (req.session.access_token) {
        next();
    } else {
        res.redirect('/');
    }
}

app.use('/auth', authRouter);

app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html')); // Adjusted to point to the index.html file in the public folder
});

app.get('/page2', isAuthenticated, (req, res) => { // Replaced checkAuth with isAuthenticated
    const user = req.session.user;
    // You might want to send a response here, like res.sendFile() or res.json()
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});