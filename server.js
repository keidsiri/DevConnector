const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const app  = express();

const db = require('./config/keys').mongoURI;
const users = require('.routes/api/users');
const profiles = require('.routes/api/profiles');
const posts = require('.routes/api/posts');

// Body parser middleware
app.use(bodyparser.urlencoded({ extended: false}));
app.use(bodyparser.json());

//Connect to db
mongoose
    .connect(db)
    .then(() => console.log('Mongodb connected'))
    .catch(err => console.log(err));

// Let's write our first route
app.get('/', (req, res) => res.send('Hello! World'));

app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/posts', posts);

const port = process.env.PORT || 5200;
app.listen(port, () => console.log(`Server running on port${port}`));


