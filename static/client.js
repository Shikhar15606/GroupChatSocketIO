const socket = io();
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container")
// const audio = new Audio('static/ting.mp3');
const append = (message,position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position =='left')
    {

        document.getElementById("my_audio").loop=false
        document.getElementById("my_audio").autoplay=false
        document.getElementById("my_audio").play()
    }
}

form.addEventListener('submit',e =>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value='';
})

const name = prompt("Enter your name to join");
if(name == null)
alert("Reload and Enter your Name")
else
socket.emit('new-user-joined', name);

socket.on('user-joined', name=>{
    append(`${name} joined the chat`,'left');
})
socket.on('receive', data=>{
    append(`${data.name}: ${data.message} `,'left');
})

socket.on('left', name=>{
    append(`${name}: left the chat `,'left');
})
