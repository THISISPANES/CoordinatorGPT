const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRouter = require('./Assets/Scripts/auth');
const apiRouter = require('./Assets/Scripts/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for body parsing
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Assets')));

// Session management
app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
}));

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
}

// Use the authentication routes
app.use('/auth', authRouter);

// Use the API routes
app.use('/api', apiRouter);

// Serve static files
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Protect the restricted route
app.get('/page2', (req, res) => {
    res.sendFile(path.join(__dirname, 'page2.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// module.exports = app;
