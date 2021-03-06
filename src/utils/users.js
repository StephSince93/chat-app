const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validata the data
    if(!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if(existingUser) {
        return {
            error: 'This username is in use!'
        }
    }

    // Store user
    const user = {id, username, room}
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) =>  user.id === id)

    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    const userInfo = users.find((user) =>  user.id === id)

    if(userInfo) {
        return {userInfo}
    }
    return {
        error: 'Message could not be sent'
    }
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const checkRoom = users.filter((user) => user.room === room )
    if (checkRoom) {
        return checkRoom
    }
    return []

}
 module.exports = {
     addUser,
     removeUser,
     getUser,
     getUsersInRoom
 }
