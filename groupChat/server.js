const io = require('socket.io')(3000)

const users = {}

// whenever a user will enter eilll getsb its own socket and will get this as the first message
io.on('connection', socket => {
    // console.log('new user')
    // socket.emit('chat-message', 'Hello-world');


    socket.on('new-user' , name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected',name)
    })

    socket.on('send-chat-message' , message => {
        // console.log(message)
        // this will send the message to everyy single user connected except for the person that sent the message
        // user[socket.id] is the id that sent the message is the id of that socket
        socket.broadcast.emit('chat-message',{message : message ,name :users[socket.id] })
    })

    socket.on('disconnect',()=> {
        socket.broadcast.emit('user-disconnected',users[socket.id])
        delete users[socket.id]
    })
})

// just start the server and go clikc on go live