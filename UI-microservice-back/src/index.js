const express = require('express')
const morgan = require('morgan');
// const { dirname } = require('path');
// const path = require('path');
const http = require ('http');
// const socketio = require('socket.io');
const { mongoose } = require('./database');
const app = express();
const server = http.createServer(app);
// const io= socketio(server);

// ---------------------------------------------------------
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

app.use("/", (request, response)=>{ 
    console.log('Here in app.use(graph3, ....)' );
    return graphqlHTTP({
        schema: schema,
        graphiql : true,
        rootValue : request,
        context : {
            request: {request, response}
        }
    })(request, response);
});
// ---------------------------------------------------------

// Settings
app.set('port', process.env.PORT || 4000);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Static files
// app.use(express.static(path.join(__dirname,'public')));

// io.on( 'connection', function( socket ) {
//     console.log( 'User Connected' );

//     socket.on('join', ({username, room})=>{
//         socket.join(room);
//     })

//     socket.on('sendMessage', (item)=>{
//         let room=item.room;
//         io.to(room).emit('sendMessage', item)
//     })

//     socket.on('sendNotification', (room)=>{
//         let message='New Notification';
//         io.to(room).emit('sendNotification', message)
//     })
    
//     socket.on('sendGroupnotification', (members)=>{
//         let message='New Notification';
//         members.forEach(element => {
//             let room=element.id;
//             io.to(room).emit('sendGroupnotification', message)
//         });
//     })

//     socket.on('sendContact', (item)=>{
//         let room=item.room_forNotification;
//         io.to(room).emit('sendContact', item)
//     })

//     socket.on( 'disconnect', function() {
//         console.log( 'User disconnected' );
//     });
// })

// Starting the server
server.listen(app.get('port'), ()=>{   // Before was app.listen(...)
    console.log(`Server on port ${app.get('port')}`);
});
