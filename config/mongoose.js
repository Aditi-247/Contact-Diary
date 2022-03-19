const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Aditi24:jyH9tCybaaPzjcqB@cluster0.jcfif.mongodb.net/contacts?retryWrites=true&w=majority');
const db = mongoose.connection;

db.on('error',console.error.bind(console,"Error"));
db.once('open',function(){
    console.log('connected');
});
module.exports = db;


// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/contacts_list_db');

// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'error connecting to db'));

// db.once('open', function(){
//     console.log('succesfully conected to the database');
// });