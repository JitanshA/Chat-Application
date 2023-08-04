const { Socket } = require('socket.io');
const { createServer } = require('http');

const httpServer = createServer();

const io = require('socket.io')(httpServer, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', socket =>{
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

})

httpServer.listen(8000, () => {
    console.log('Socket.io server is running on http://localhost:8000');
});
