const socket = io('http://127.0.0.1:8000')                 // connection for client socket connection -> IMP 
const form = document.getElementById('send-container')     // getiing send-container from  DOM
const messageInput = document.getElementById('msgInp')    // getting message input from DOM
const messageContainer = document.querySelector('.container')    // getting message containere from DOM 
const nameDiv = document.getElementById('name');     // for adding name
const audio = new Audio('/utils/ting.mp3');    // for listening audio when new message occurs


// appendMessage function to add all the messages on users screen 

const appendMessage = (message, position) => {

    const messageElement = document.createElement('div');

    messageElement.innerText = message
    messageElement.classList.add('message')
    messageElement.classList.add(position)
    messageContainer.appendChild(messageElement)
    if (position == 'left') {
        audio.play();
    }
}

// getting name from user 

const name = prompt("Enter your name to join")

// setting name on users screen 

nameDiv.innerText = name

// emmitting new user joined event

socket.emit('new-user-joined', name)

// event for user joined event 

socket.on('user-joined', name => {
    appendMessage(`${name} joined the chat`, 'center')
})

// event for when receiving message 

socket.on('receive', data => {
    appendMessage(`${data.name}: ${data.message}`, 'left')
})

// event when person leaves 

socket.on('left', name => {
    appendMessage(`${name} left the chat`, 'center')
})


// event listener for form submit event 

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value
    appendMessage(`You: ${message}`, 'right');
    socket.emit('send', message)
    messageInput.value = ''
})