const {Book, Comment} = require('../public/js/model');

const checkComicOwner = async (req,res, next) => {
    const comic = await Book.findById(req.params.id).exec()
    console.log(req.user._id, comic.owner.id)
    if (comic.owner.id.equals(req.user._id)) {
        res.locals.comic = comic;
        next()
    } else {
        res.redirect('back')
        req.session.error = 'You must be owner to edit this post'
    }
}

const checkCommentOwner = async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId).exec()
    if(comment.user.id.equals(req.user._id)){
        res.locals.comment = comment
        next()
    } else {
        res.redirect('back');
        req.session.error = 'You must be comment owner'
    }
    
}







module.exports = {checkComicOwner, checkCommentOwner}