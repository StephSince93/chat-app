const socket = io()

// Elements
const $messageForm = document.querySelector('#textForm')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

const $locationButton = document.querySelector('#send-location')

const $messages = document.querySelector('#messages')
const $locations = document.querySelector('#locations')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML


socket.on('location', (location) => {
        console.log(locationTemplate)
        const html = Mustache.render(locationTemplate, {
            location
        })
        $locations.insertAdjacentHTML('beforeend', html)
})

socket.on('message', (message) => {
    console.log(messageTemplate)
    const html = Mustache.render(messageTemplate, {
        message
    })
    $messages.insertAdjacentHTML('beforeend', html)

})

$messageForm.addEventListener('submit', (e) => {
        e.preventDefault()

        $messageFormButton.setAttribute('disabled', 'disabled')

        const message = e.target.elements.message.value

        socket.emit('sendMessage', message, (error) => {

            $messageFormButton.removeAttribute('disabled')
            $messageFormInput.value = ''
            $messageFormInput.focus()

            if(error) {
                return console.log(error)
            }
            console.log('The message was delivered!', message)    
        })
})

$locationButton.addEventListener('click', () => {

    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        }, (message) => {
            $locationButton.removeAttribute('disabled')
            console.log(message)

        })
    })
})