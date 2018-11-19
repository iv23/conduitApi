const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { User } = require('../../db/sequelize');
const auth = require('../auth');

const secret = "Hello this is my jwtToken";

router.get('/users', (req, res, next) => {
    console.log(req.payload);
    return User.findByPk().then(user => {
        if(!user){ return res.sendStatus(401); }

        return res.json({user: toAuthJSON(user)});
    });
}, auth.required);

router.post('/users/login', function(req, res, next){
    if(!req.body.user.email){
        return res.status(422).json({errors: {email: "can't be blank"}});
    }

    if(!req.body.user.password){
        return res.status(422).json({errors: {password: "can't be blank"}});
    }

    passport.authenticate('local', {session: false}, function(err, user, info){
        if(err){ return next(err); }

        if(user){
            user.token = generateJWT(user);
            return res.json({user: toAuthJSON(user)});
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
});

router.post('/users', (req, res) => {
  const userPost = req.body.user;
  const user = User .build({
      email: userPost.email,
      username: userPost.username,
  });
  user.salt = crypto.randomBytes(16).toString('hex');
  user.hash = crypto.pbkdf2Sync(userPost.password, user.salt, 10000, 256, 'sha256').toString('hex');
  user.save()
       .then(user => res.json(user))
});
// get all users
router.get('/', (req, res) => {
    User.findAll().then(users => res.json(users))
});

function generateJWT(user){
    return jwt.sign(
        {
            id: user.id
        },
        secret,
        {
            expiresIn: 86400
        }
    );
}

function toAuthJSON(user){
  return {
      username: user.username,
      email: user.email,
      token: generateJWT(user),
      bio: user.bio,
      image: user.image
  };
}

module.exports = router;
