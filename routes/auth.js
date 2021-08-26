const express = require('express');
const router = express.Router();
const {User} = require('../public/js/model');
const passport = require('passport');


// Sign up - New
router.get('/signup', (req, res) => {
    res.render('signup');
});

// Sign up - Create 
router.post('/signup', async (req, res) => {
    try {
        const newUser = await User.register(new User({
            email: req.body.email,
            username: req.body.username
        }), req.body.password)
        console.log(newUser);
        passport.authenticate('local')(req, res, () => {
            res.redirect('/comics')
        });
    }
    catch (err) {
        console.log(err);
        res.send(err)
    }
});

// Login show form
router.get('/login', (req, res) => {
    res.render('login');
});

// Login Post
router.post('/login', passport.authenticate('local', {
    successRedirect: '/comics',
    failureRedirect: '/login'
}))


// Logout
router.get('/logout', (req, res, next) => {
req.logout()
res.redirect('/comics')
})
module.exports = router