const mongoose = require('mongoose');

const URI='mongodb://fabian:12345@mongodb2:27017/mydatabase?authSource=admin';
//const URI='mongodb://fabian:12345@localhost:27018/mydatabase?authSource=admin';

mongoose.connect(URI)
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));

module.exports = mongoose;
