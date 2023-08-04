const socket = io("http://localhost:8000");

const form = document.getElementById('send_container');
const messageInput = document.getElementById('message_input');
const messageContainer = document.querySelector(".chatbox");

var audio = new Audio("Audios/snd_fragment_retrievewav-14728.mp3");

// Adds new textboxes to the chatbox with the messages
const append = (message, type) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(type);
    messageContainer.append(messageElement);
    if (type == 'other'){
        audio.play();
    }
}


// Get the user's name and let the sever know
const name = prompt("Enter your name: ");
socket.emit('new-user-joined', name);

// Receive the name of a newly-joined user
socket.on('user-joined', name => {
    append(`${name} joined the chat`,  'other');
});

// Send server the messages submitted
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'user');
    socket.emit('send', message);
    messageInput.value = "";
});

// Receive messages from other users
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'other');
});

// Let everyone know that a user left
socket.on('left', name => {
    append(`${name} left the chat`, 'other');
});
