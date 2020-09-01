const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

//let count = 0


 io.on('connection', (socket) => {
     console.log('New Websocket connection!')

//     socket.emit('countUpdated', count)

    socket.on('sendMessage', (message) => {
        //socket.emit('countUpdated', count) //Only emits to a specific client connection
        io.emit('message', message) //Emits to all client connections
    })

//     socket.on('increment', () => {
//         count++
//         //socket.emit('countUpdated', count) //Only emits to a specific client connection
//         io.emit('countUpdated', count) //Emits to all client connections
//     })
 })

server.listen(port, () => {
    console.log(`Listening on ${port}`)
})