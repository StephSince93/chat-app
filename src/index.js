const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

//let count = 0


 io.on('connection', (socket) => { // connection, default by socket.io

    
    socket.on('join', ({username, room}) => {
        socket.join(room)
        
        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`))// Emits to all client connections, except for the client connecting
        // socket.emit, io.emit, socket.broadcast.emit
        // io.to.emit, socket.broadcast.to.emit
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        //socket.emit('message', message) //Only emits to a specific client connection
        io.to('Test').emit('message', generateMessage(message)) //Emits to all client connections
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        //socket.emit('message', message) //Only emits to a specific client connection
        io.emit('location', generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`)) //Emits to all client connections
        callback('Location shared!')
    })

    socket.on('disconnect', () => { //disconnect, default by socket.io
        io.emit('message',generateMessage('A user has left!'))
    })
 })

server.listen(port, () => {
    console.log(`Listening on ${port}`)
})