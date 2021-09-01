const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')


const BookSchema = new mongoose.Schema({
    title : String,
    author: String,
    review: String,
    publisher: String,
    date: Date,
    series: String,
    issue: Number,
    genre: String, 
    color: Boolean,
    cover: String,
    owner: {
        id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }, 
        username: String,
    },
    upvotes:{
        require: false,
        type: [String]
    },
    downvotes: {
        require: false,
        type: [String]
    } 
});

const Book = mongoose.model('Book', BookSchema)
// INDEX
BookSchema.index({
    title: 'text',
    author: 'text',
    review: 'text',
    publisher: 'text',
    series: 'text',
    genre: 'text',
    cover: 'text',
                         
});
Book.createIndexes();




// comment model

const commentSchema = new mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }, 
    username: String,
    },
    text: String,
    comicId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Comic'
    },
});

const Comment = mongoose.model('Comment', commentSchema)



// USER MODEL

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true },
    email: {type: String, required: true, unique: true }
});

userSchema.plugin(plm);
const User = mongoose.model('User', userSchema)

module.exports = {Book, Comment, User}