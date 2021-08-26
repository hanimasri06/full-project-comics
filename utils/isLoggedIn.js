const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        req.flash("error", "Hey! You must be logged in to do that, brotha!")
        res.redirect('/login')
    }
}


module.exports = isLoggedIn