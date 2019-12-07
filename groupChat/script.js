const socket = io('http://localhost:3000')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const messageContainer = document.getElementById('message-container')



const name = prompt('what is your name');
appendMessage('You Joined')
socket.emit('new-user',name)


socket.on('chat-message' ,data =>{
    // console.log(data)
    appendMessage(`${data.name} : ${data.message}`)
})

socket.on('user-connected',name => {
    appendMessage(`${name} connected`)
})

socket.on('user-disconnected' ,name => {
    appendMessage(`${name} disconnected`)
})

messageForm.addEventListener('submit' , e => {

    // e.preventDefault will stop our page from sending to the server and refreshing too
    e.preventDefault();
    const message = messageInput.value
    // this is for the user sending the message willl see himself
    appendMessage(`You :  ${message}`)
    socket.emit('send-chat-message' , message);
    messageInput.value = '';

})

function appendMessage(message){
    console.log(message)
    var messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement)
}