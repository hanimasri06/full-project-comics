const {Book, Comment} = require('../public/js/model');

const checkComicOwner = async (req,res, next) => {
    const comic = await Book.findById(req.params.id).exec()
    if (comic.owner.id.equals(req.user._id)) {
        res.locals.comic = comic;
        next()
    } else {
        req.flash('error', 'You need to be the comic owner to edit this comic')
        res.redirect('back')
    }
}

const checkCommentOwner = async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId).exec()
    if(comment.user.id.equals(req.user._id)){
        res.locals.comment = comment
        next()
    } else {
        req.flash('error', 'You must be comment owner')
        res.redirect('back');
    }
    
}







module.exports = {checkComicOwner, checkCommentOwner}