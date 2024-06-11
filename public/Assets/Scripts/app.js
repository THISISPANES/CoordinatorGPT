// app.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const apiRouter = require('./api');
const authRoutes = require('./auth.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'Assets')));

app.use(session({
    secret: '."W90N.{tM$+8k&jf7\J.+vb)T@wu+f3n6]k4=&q',
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

app.use('/api', isAuthenticated, apiRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/page2', checkAuth, (req, res) => {
    const user = req.session.user;
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
