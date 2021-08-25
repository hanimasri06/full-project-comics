const express = require('express');
const router = express.Router()
const isLoggedIn = require('../utils/isLoggedIn')
router.get('/', (req, res, next) => {
    res.render('index')
})

router.get('/account', isLoggedIn, (req, res, next) => {
    res.render('account')
})



module.exports = router