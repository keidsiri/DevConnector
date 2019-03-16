const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');


//Load user model
const User = require('../../models/Users');

//@route  POST api/users/register
//@desc   Register user
//@access public
router.post('/register', (req, res) => {
 User.findOne({email: req.body.email})
   .then(user => {
     if(user) {
       return res.status(400).json({email: 'Email already exists'});
     } else {
       const avatar = gravatar.url(req.body.email, {
         s: '200',
         r: 'pg',
         d: 'mm'
       })
       const newUser = new User({
         name: req.body.name,
         email: req.body.email,
         password: req.body.password,
         avatar //means avatar: avatar
       });

       bcrypt.genSalt(10, (err, salt) => {
         if(err){
           return res.status(400).json({password: 'Failed encrypting'});
         }

         bcrypt.hash(newUser.password, salt, (err, hash) => {
           if(err){
             return res.status(400).json({password: 'Failed encrypting'});
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

router.post('/login', (req, res) => {
 const email = req.body.email;
 const password = req.body.password;

 User.findOne({email})
   .then(user => {
     if(!user) {
       return res.status(400).json({email: 'User not found'});
     }

     //check password
     bcrypt.compare(password, user.password)
       .then(isMatch => {
         if(isMatch) {
           const payload = {
             id: user.id,
             name: user.name,
             avatar: user.avatar
           };

           //Sign token
           jwt.sign(payload,keys.secretOrKey,{expiresIn: 3600 }, (err, token) => {
             return res.json({
               success: true,
               token: 'Bearer ' + token
             });
           })
         }
         else {
           return res.status(400).json({password: 'Password incorrect'});
         }

       })
       .catch();
   })
   .catch(err => console.log(err));
})

//GET api/users/current
//@desc returns current user information
// @access private

router.get('/current', passport.authenticate('jwt',{session: false}), (req, res) => {
 res.json({msg: 'Success'});
})


module.exports = router;