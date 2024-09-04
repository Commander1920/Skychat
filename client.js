const socket = io("http://localhost:8000");
const form = document.getElementById('sendMessage');
const messageInput = document.getElementById('messageInput');
const messageContainer = document.querySelector(".chatbox");
var notificationSent = new Audio('NotificationSoundSending.mp3');
var notificationRecieved = new Audio('NotificationSoundRecieving.mp3')

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    messageElement.scrollIntoView();

    if(position=='left')
    {
    notificationRecieved.play();
    }
    if(position=='right')
    {
    notificationSent.play();
    }
}

form.addEventListener('submit', (e) => {
e.preventDefault();
const message = messageInput.value.trim();
if (message === "")
    {
        messageInput.value = '';
        return;
    }
append(`You: ${message}`, 'right');
socket.emit('send', message);
messageInput.value = '';
});


const username = localStorage.getItem('username');
socket.emit('new-user-joined', username);

socket.on('user-joined', username => {
    append(`${username} joined the Chat.`, 'left');
});

socket.on('recieve', data => {
    append(`${data.name} : ${data.message}`, 'left');
});

socket.on('left', username => {
    append(`${username} left the Chat.`, 'left');
});
