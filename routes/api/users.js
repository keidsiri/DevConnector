const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//Load user model
const User = require('../../models/User');

//Load input validation
const validateRegisterInput = require('../../validation/register');
const validateRLoginInput = require('../../validation/login');


// @route   POST api/users/register
// @desc    Register user
// @access  public
router.post('/register', (req, res) => {
  const {errors, isValid} = validateRegisterInput(req.body);

  //Check validation
  if (!isValid){
    return res.status(400).json(errors);
  }

  User.findOne({email: req.body.email})
    .then(user => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
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
          avatar
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err){
            errors.password = 'Failed encrypting';
            return res.status(400).json(errors);
          } 

          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err){
              errors.password = 'Failed hashing';
              return res.status(400).json(errors);
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

// @route   POST api/users/login
// @desc    Login user
// @access  public
router.post('/login', (req, res) => {
  const {errors, isValid} = validateLoginInput(req.body);

  //Check validation
  if (!isValid){
    return res.status(400).json(errors);
  }


  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email})
    .then(user => {
      if (!user){
        return res.status(400).json({email: 'User not found'});
      }

      //Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch){

            //User matched
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            };

            //Sign token
            jwt.sign(
              payload, 
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                  return res.json({
                    success: true,
                    token: 'Bearer ' + token
                  });
              }
            );
          }
          else {
            return res.status(400).json({password: 'Password incorrect'});
          }
        });
    })
    .catch(err => console.log(err));
})

// @route   GET api/users/current
// @desc    returns current user information
// @access  private
router.get(
  '/current',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
)

module.exports = router;