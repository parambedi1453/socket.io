const express = require('express')
const app = express()
const server = require('http').Server(app) //this will pass server to app and give server which can pass to io and give us the server
const io = require('socket.io')(server)


app.set('views','./views')
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended : true }))

const rooms = {}

app.get('/' ,(req,res) => {
    res.render('index', {rooms : rooms})
})

app.get('/:room' , (req,res) => {
    if(rooms[req.params.room] == null){
        // user requesting a not availabe room
        return res.redirect('/')
    }
    res.render('room',{roomName : req.params.room})
})

app.post('/room' ,(req,res) => {
    if(rooms[req.body.room]!=null)
    {
        // means room already exist
        return res.redirect('/')
    }
    rooms[req.body.room] = {users : {} }
    res.redirect(req.body.room)
    // send mesg that new room was created
    io.emit('room-created',req.body.room)
})
server.listen(3000);




// whenever a user will enter eilll getsb its own socket and will get this as the first message
io.on('connection', socket => {
    console.log('new user')
    // socket.emit('chat-message', 'Hello-world');


    socket.on('new-user' ,(room, name) => {
        socket.join(room)
        rooms[room].users[socket.id] = name
        socket.to(room).broadcast.emit('user-connected',name)
    })

    socket.on('send-chat-message' ,(room, message) => {
        // console.log(message)
        // this will send the message to everyy single user connected except for the person that sent the message
        // user[socket.id] is the id that sent the message is the id of that socket
        socket.to(room).broadcast.emit('chat-message',{message : message ,name :rooms[room].users[socket.id] })
    })

    socket.on('disconnect',()=> {
        getUserRooms(socket).forEach(room => {
            socket.to(room).broadcast.emit('user-disconnected',rooms[room].users[socket.id])
            delete rooms[room].users[socket.id]
        })

        // socket.broadcast.emit('user-disconnected',rooms[room].users[socket.id])
        // delete rooms[room].users[socket.id]
    })
})


function getUserRooms(socket)
{
    return Object.entries(rooms).reduce((names,[name,room]) =>{
        if(room.users[socket.id]!=null)names.push(name)
        return names
    },[])
}

// just start the server and go clikc on go live