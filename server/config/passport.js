const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

module.exports = passport => {
    passport.use('local-login',
        new localStrategy({ usernameField: 'email' }, (username, password, done) => {
            User.findOne({ email: username })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'user does not exist' })
                    }

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'password incorrect' });
                        }
                    })
                })
                .catch(err => console.log(err));
        })
    )


    passport.use('local-register',
        new localStrategy({ usernameField: 'email', passReqToCallback: true },

            (req, email, password, done) => {
                var generateHash = (password) => {
                    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                };

                User.findOne({ email }).then((user) => {

                    if (user) {
                        return done(null, false, { message: 'That user already exist' });
                    }

                    else {
                        var userPassword = generateHash(password);
                        var data =
                        {
                            numberID: req.body.numberID,
                            password: userPassword,
                            email: email,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            city: req.body.city,
                            street: req.body.street,
                            role: 'user'
                        };

                        User.create(data).then((newUser, created) => {
                            if (!newUser) {
                                return done(null, false);
                            }

                            if (newUser) {
                                return done(null, newUser);

                            }
                        });
                    }
                });
            }
        ))

    passport.serializeUser((user, done) => {
            done(null, user.id);
        })

    passport.deserializeUser((id, done) => {
            User.findById(id)
            .then(user => done(null, user))
            .catch(err => done(err))
        });
}