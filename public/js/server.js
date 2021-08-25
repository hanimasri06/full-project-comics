const mongoose = require('mongoose')

require('dotenv').config()

const conn = process.env.DB_CONNECT

const connection = mongoose.connect(`${conn}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true}).then(() => console.log("Database connected!")).catch(err => console.log(err));





    module.exports = {connection, conn}