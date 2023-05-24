const app = require('express')();    // require express package 
const http = require('http').createServer(app)    // require http package and create server 
const io = require('socket.io')(http, {      // require socket.io package 
    cors: {
        origin: "*"
    }
})

// define port no where server will listen 
const PORT = 8000;


const users = {}   // users object where all users will be added dynmaically


// events for on connection  to happen 
io.on('connection', socket => {


    // event for when a new user joins 
    socket.on('new-user-joined', name => {

        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    })

    // event for when a message is sent from people
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    })

    // event for when a person leaves 
    socket.on('disconnect', name => {

        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id]
    })
})


// server listening on port no 
http.listen(PORT)