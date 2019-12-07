var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)

server.listen(3000);

users = {}

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
})


io.sockets.on('connection' ,function(socket){

    socket.on('new user' , function(data,callback){
        if(data in users){
            callback(false)
        }else{
            callback(true)
            socket.nickname = data;
            users[socket.nickname] = socket
            // io.sockets.emit('usernames',nicknames)
            updateNicknames();
        }
    })

    socket.on('send message' , function(data,callback){

        var msg = data.trim()
        if(msg.substr(0,3) === '/w ')
        {
            msg = msg.substr(3);
            var ind = msg.indexOf(' ')
            if(ind != -1)
            {
                var name = msg.substr(0,ind)
                var msg = msg.substr(ind+1)
                if(name in users)
                {
                    users[name].emit('wisper' ,{msg :msg,nick : socket.nickname})
                    console.log('wisper')
                }
                else{
                    console.log('enter a valid name ')
                }
               
            }
            else{
                callback('please enter the messsg fot wispwr')
            }
        }
        else{
            io.sockets.emit('new message',{msg: data ,nick : socket.nickname})//will send message includoing me 
        // io.socket.broadcast.emit('new message' , data)//will send to everyone elese me
        }
        
    })

    socket.on('disconnect',function(data){
        if(!socket.nickname) return;
        delete users[socket.nickname]
        updateNicknames();
    })
    function updateNicknames()
    {
      io.sockets.emit('usernames',Object.keys(users))

    }
})























/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/
// var express = require('express')
// var app = express()
// var server = require('http').createServer(app)
// var io = require('socket.io').listen(server)

// server.listen(3000);

// nicknames = []

// app.get('/',function(req,res){
//     res.sendFile(__dirname + '/index.html');
// })


// io.sockets.on('connection' ,function(socket){

//     socket.on('new user' , function(data,callback){
//         if(nicknames.indexOf(data)!=-1){
//             callback(false)
//         }else{
//             callback(true)
//             socket.nickname = data;
//             nicknames.push(socket.nickname)
//             // io.sockets.emit('usernames',nicknames)
//             updateNicknames();
//         }
//     })

//     socket.on('send message' , function(data){
//         io.sockets.emit('new message',{msg: data ,nick : socket.nickname})//will send message includoing me 
//         // io.socket.broadcast.emit('new message' , data)//will send to everyone elese me
//     })

//     socket.on('disconnect',function(data){
//         if(!socket.nickname) return;
//         nicknames.splice(nicknames.indexOf(socket.nickname),1);
//         updateNicknames();
//     })
//     function updateNicknames()
//     {
//       io.sockets.emit('usernames',nicknames)

//     }
// })