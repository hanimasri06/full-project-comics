
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
req.flash('error', "There was an error searching the database")
}
})

router.get('/genre/:genre', async (req, res, next) => {
    // Check if the given genre is valid 
    const validGenres = ['superhero', 'manga', 'slice-of-life', 'humor', 'sci-fi', 'fantasy', 'horror', 'action', 'nonficiton']
    
    if (validGenres.includes(req.params.genre.toLocaleLowerCase())) {
    // If yes continue
    const comics = await Book.find({genre: req.params.genre}).exec()
    res.render('comics', {comics})
    }
    else {
        // If no, send error
        req.flash('error', 'There was an error searching the database')
        res.send('error')
    }

} )
//vote logic
router.post('/vote', isLoggedIn, async (req, res, next) => {
console.log('Request body:', req.body);
try {
    const comic = await Book.findById(req.body.comicId)
    const alreadyUpvoted = comic.upvotes.indexOf(req.user.username) // will be -1 if not found
    const alreadyDownvoted = comic.downvotes.indexOf(req.user.username) // will be -1 if not found

    let response = {}
    // use the splice badel remove or delete. Beacause delete will not reindex or shorten the array.
    switch (true) {
        case alreadyDownvoted === -1 && alreadyUpvoted === - 1 : // has not voted before
            if (req.body.voteType === 'up') { // upVoting
                comic.upvotes.push(req.user.username);
                await comic.save();
                response = {message: "upVote succesfull", code: 1}
            } else if (req.body.voteType === 'down') { // downVoting
                comic.downvotes.push(req.user.username);
                await comic.save();
                response = {message: "downvote succesfull", code: -1}
            } else {                                   // error
                response = {message: 'Error 1', code: 'err'}
            }
            break;
        case alreadyUpvoted >=0 : // Already upVoted
        comic.upvotes.splice(alreadyUpvoted, 1)
            if (req.body.voteType === 'up') {
                await comic.save();
                response = {message: 'Removed your vote', code: 0}
            } else if (req.body.voteType === 'down') {
                comic.downvotes.push(req.user.username)
                await comic.save();
                response = {message: 'Changed to downvote', code: -1}
            } else {
                response = {message: 'Error 2', code: 'err'}
            }
            break;
        case alreadyDownvoted >=0 : // Already downVoted
        comic.downvotes.splice(alreadyDownvoted, 1);
        if (req.body.voteType === 'up') {
            comic.upvotes.push(req.user.username)
            await comic.save();
            response = {message: 'Changed to upVote', code: 1}
        } else if (req.body.voteType === 'down') {
            await comic.save();
            response = {message: 'Removed downvote', code: 0}
        } else {
            response = {message: 'Error 3', code: 'err'}
        }
            break;
    }
    // Update score immediately prior to sending
    response.score = comic.upvotes.length - comic.downvotes.length 
    res.json(response);
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
    req.flash('error', 'There was an error finding this comic')
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
            },
            upvotes: [],
            downvotes: []  
            
    
        });
        try {
        const saving = await newBook.save();
        req.flash('success', `${newBook.title} was added successfully`)
        res.redirect(`/comics/${saving._id}`)
    }
    catch (err) {
        req.flash('error', 'There was an error creating the comic')
    }

})

// FORM TO EDIT
router.get('/:id/edit',isLoggedIn ,checkComicOwner,async (req, res, next) => {
    // check if user is logged in 
    // if not logged in redirect to login
    // if logged in check if they own the comic
    // If not redirect them to show page
    // If owner render comcis edit
    try {
        res.render('comics_edit')
        
    }
    catch (err) {
        
    }
    
    
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
            req.flash('success',`${comicBody.title} was edited successfully`)
            res.redirect(`/comics/${req.params.id}`)
    }
    catch (err) {
        req.flash('error', 'There was an error')
        res.redirect('/comics')
    }
});

// DELETE
router.delete('/:id', isLoggedIn, checkComicOwner,async (req, res, next) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id).exec()
        req.flash('success', `${deletedBook.title} is deleted`)
        res.redirect('/comics');
    }
    catch (err) {
        req.flash('error', 'There was an error deleting')
    }
})


module.exports = router;
