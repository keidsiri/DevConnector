const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const passport =  require('passport')
const app  = express();
const db = require('./config/keys').mongoURI;

const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');
const posts = require('./routes/api/posts');


// Body parser middleware
app.use(bodyparser.urlencoded({ extended: false}));
app.use(bodyparser.json());

//Connect to db
mongoose
    .connect(db)
    .then(() => console.log('Mongodb connected'))
    .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());
//passport config
require('./config/passport')(passport);

// Let's write our first route
app.get('/', (req, res) => res.send('This is the new React project'));

app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/posts', posts);

const port = process.env.PORT || 5300;
app.listen(port, () => console.log(`Server running on port ${port}`));


