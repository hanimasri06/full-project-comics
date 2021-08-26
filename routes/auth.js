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
            req.flash('success', `Signed you up as ${newUser.username}`)
        passport.authenticate('local')(req, res, () => {
            res.redirect('/comics')
        });
    }
    catch (err) {
        req.flash('error', 'There was an error signing you up')
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
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'logged in sucessfully'
}))


// Logout
router.get('/logout', (req, res, next) => {
req.logout()
req.flash('success', "Logged Out")
res.redirect('/comics')
})
module.exports = router