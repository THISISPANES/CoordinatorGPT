const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./auth');
const apiRouter = require('./api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
// Use the authentication routes
//helo
// hey leland chung!!
app.use('/auth', authRouter);
// Use the API routes
app.use('/api', apiRouter);
app.use(express.static(__dirname));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// module.exports = app;
