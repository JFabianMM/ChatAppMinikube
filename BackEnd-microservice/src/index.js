const express = require('express')
const morgan = require('morgan');
const { dirname } = require('path');
const path = require('path');
const http = require ('http');
const { mongoose } = require('./database');
const app = express();
const server = http.createServer(app);

// Settings
app.set('port', process.env.PORT || 4001);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Routes that define the Microservices APIs
app.use('/api/users', require('./routes/user.routes'));

// Static files
// app.use(express.static(path.join(__dirname,'public')));

// Starting the server
server.listen(app.get('port'), ()=>{   // Before was app.listen(...)
    console.log(`Server on port ${app.get('port')}`);
});
