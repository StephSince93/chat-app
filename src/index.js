const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

//let count = 0


 io.on('connection', (socket) => { // connection, default by socket.io

    
    socket.on('join', (options, callback) => {
        console.log(options)
        const {error, user} = addUser({id:socket.id, ...options})

        if(error) {
            return callback(error)
        }

        
        socket.join(user.room)
        
        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`))// Emits to all client connections, except for the client connecting


        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        //socket.emit('message', message) //Only emits to a specific client connection
        io.to('yeh').emit('message', generateMessage(message)) //Emits to all client connections
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        //socket.emit('message', message) //Only emits to a specific client connection
        io.emit('location', generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`)) //Emits to all client connections
        callback('Location shared!')
    })

    socket.on('disconnect', () => { //disconnect, default by socket.io

        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message',generateMessage(`${user.username} has left!`))
        }

    })
 })

server.listen(port, () => {
    console.log(`Listening on ${port}`)
})