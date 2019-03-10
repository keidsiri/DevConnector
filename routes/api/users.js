const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

//Load user model
const User = require('../../models/Users');


// @route  POST api/users/register
// @desc   Register user
// @access public
router.post('/register', (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                return res.status(400).json({email: 'Email already exist!'})
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', 
                    r: 'pg',
                    d: 'mm'
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: avatar  //if the left same on the right you can colapse and just type avatar (it's js syntax)
                });

                bcrypt.genSalt(10, (err, salt) => {
                    if (err){
                        return res.status(400).json({password: 'Failed encrpying'});
                    }

                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err){
                            return res.status(400).json({password: 'Failed hashing'});
                        }
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));


                    })
                })


            }
        })
        .catch(err => console.log(err));
        
});


// @route  POST api/users/register
// @desc   Login user
// @access public

router.post('/login', (req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if (!user){
                return res.status(400).json({email:'User not found'});
            }

            //check password
            bcrpyt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch){
                        return res.json({msg: 'Success'});
                    }
                    return res.status(400).json({password: 'Password Incorrect'});
                })
        })
        .catch(err => console.log(err));
})



module.exports = router;
