const passport = require('passport');
const LocalStrategy = require('passport-local');
const { User } = require('../db/sequelize');
const crypto = require('crypto');

passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]'
}, (email, password, done) => {
    User.findOne({where: {email: email}}).then(user => {
        if(!user || !validatePassword(password, user)){
            return done(null, false, {errors: {'email or password': 'is invalid'}});
        }

        return done(null, user);
    }).catch(done);
}));

const validatePassword = function(password, userFromDB){
    const hash = crypto.pbkdf2Sync(password, userFromDB.salt, 10000, 256, 'sha256').toString('hex');
    return hash === userFromDB.hash;
};

passport.serializeUser(function(user, done) {
    done(null, user.id);
});


// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
        if(user){
            done(null, user.get());
        }
        else{
            done(user.errors,null);
        }
    });

});