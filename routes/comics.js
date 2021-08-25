
const express = require('express');
const router = express.Router()
const {Book, Comment} = require('../public/js/model')
const isLoggedIn = require('../utils/isLoggedIn')
const {checkComicOwner} = require('../utils/checkowner')
// INDEX
router.get('/', async (req, res, next) => {
    try {
        const comics = await Book.find();
        res.render('comics', {comics})
    }
    catch (err) {
        console.error(err)
        res.send(err)
    }
})

// NEW
router.get('/new', isLoggedIn, (req, res, next) => {
    res.render('newComics')
})

// Search
router.get('/search', async (req, res, next) => {
try {
const comics = await Book.find({
    $text: {
        $search: req.query.term
    }
});
res.render('comics', {comics})
}
catch (err) {
console.log(err)
}
})

// SPECIFIC
router.get('/:id', async (req, res, next) => {
try {
const book = await Book.findById(req.params.id).exec();
const comments = await Comment.find({comicId: req.params.id}).exec();
res.render('specificBook', {comics: book, comments})

}
catch (err) {
    console.error(err)
    res.send(err)
} 
});

// CREATE
router.post('/',  isLoggedIn, async (req, res, next) => {

        const genre = req.body.genre.toLowerCase()
        const date = req.body.date.split('T')[0]
        const newBook = new Book({
            title: req.body.title,
            author: req.body.author,
            cover: req.body.cover,
            review: req.body.review,
            date,
            series: req.body.series,
            issue: req.body.issue,
            publisher : req.body.publisher,
            // genre should always be lower case
            // genre and color (select and checkbox) need to be parsed to be saved correctly in the data base
            genre,
            // double negation is the same, this way we get a boolean 
            color: !!req.body.color,
            owner: {
                id: req.user._id,
                username: req.user.username
            }
            
    
        });
        try {
        const saving = await newBook.save()
        res.redirect(`/comics/${saving._id}`)
        console.log('CREATED:',saving)
    }
    catch (err) { console.log(err)}

})

// FORM TO EDIT
router.get('/:id/edit',isLoggedIn ,checkComicOwner,async (req, res, next) => {
    // check if user is logged in 
    // if not logged in redirect to login
    // if logged in check if they own the comic
    // If not redirect them to show page
    // If owner render comcis edit
    res.render('comics_edit')
    
});

// EDIT
router.put('/:id', isLoggedIn,checkComicOwner,async (req, res, next) => {
        const genre = req.body.genre.toLowerCase()
        const comicBody = {
            title: req.body.title,
            author: req.body.author,
            cover: req.body.cover,
            review: req.body.review,
            date: req.body.date,
            series: req.body.series,
            issue: req.body.issue,
            publisher : req.body.publisher,
            genre,
            color: !!req.body.color,};
            try {   
            const found = await Book.findByIdAndUpdate(req.params.id, comicBody, {new: true, useFindAndModify: false}).exec()
            console.log(found);
            res.redirect(`/comics/${req.params.id}`)
    }
    catch (err) {
        console.log(err)
        res.redirect('/comics')
    }
});

// DELETE
router.delete('/:id', isLoggedIn, checkComicOwner,async (req, res, next) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id).exec()
        console.log('DELETED:', deletedBook);
        res.redirect('/comics');
    }
    catch (err) {
        console.log(err)
    }
})


module.exports = router;