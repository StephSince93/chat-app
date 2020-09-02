const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

//let count = 0


 io.on('connection', (socket) => { // connection, default by socket.io
     console.log('New Websocket connection!')

    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has joined!')// Emits to all client connections, except for the client connecting

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        //socket.emit('message', message) //Only emits to a specific client connection
        io.emit('message', message) //Emits to all client connections
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        //socket.emit('message', message) //Only emits to a specific client connection
        io.emit('location', `https://google.com/maps?q=${location.latitude},${location.longitude}`) //Emits to all client connections
        callback('Location shared!')
    })

    socket.on('disconnect', () => { //disconnect, default by socket.io
        io.emit('message','A user has left!')
    })
 })

server.listen(port, () => {
    console.log(`Listening on ${port}`)
})