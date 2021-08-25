const express = require('express');
const router = express.Router({mergeParams: true})
const {Comment, Book} = require('../public/js/model')
const isLoggedIn = require('../utils/isLoggedIn')
const {checkCommentOwner} = require('../utils/checkowner')
// New Comment - Show Form
router.get('/new', isLoggedIn , (req, res, next) => {
    console.log(req.params.id)
    res.render('comments_new', {comicId: req.params.id, user: req.user.username})})

// Create Comment - Actually Update DB
router.post('/', isLoggedIn ,async (req, res, next) => {
    try {
        const cmnt = await Comment.create({
            user: {
                id: req.user._id,
                username: req.user.username},
            text: req.body.comment,
            comicId: req.body.comicId,
    })
        console.log(cmnt);
        res.redirect(`/comics/${req.params.id}`)
    }
    catch (err) {
        console.log(err); 
    }
})

// Edit Comment 
router.get('/:commentId/edit', isLoggedIn ,checkCommentOwner,async (req, res, next) => {
    try {
        const comic = await Book.findById(req.params.id).exec();
        res.render('comments_edit', {comic})
    }
    catch (err) {
        console.log(err)
        res.send('Broke comment Edit')
    }
});

router.put('/:commentId', isLoggedIn ,checkCommentOwner,async (req, res, next) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.comment}, {new: true, useFindAndModify: false}).exec()
        console.log(comment)
        res.redirect(`/comics/${req.params.id}`)
    }
    catch (err) {
        console.log(err)
        res.redirect('/comics')
    }
})

router.delete('/:commentId', isLoggedIn ,checkCommentOwner,async (req, res, next) => {
    try {
        const found = await Comment.findByIdAndDelete(req.params.commentId)
        console.log(found)
    res.redirect(`/comics/${req.params.id}`)
    }
    catch (err) {
        console.log(err)
        res.send('error')
    }
})


module.exports = router;