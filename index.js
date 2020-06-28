const express = require("express");
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
//        url        on which this folder  is hosted
// this is necessary as a server do not take image sound css or javascript files from a folder
// it takes all these files from a server on which these files are hosted
app.use(express.urlencoded())

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory

// ENDPOINTS
app.get('/', (req, res) => {
  const params = {}
  res.status(200).render('index.pug', params);
})

// socket.io

const users ={};
io.on('connection',socket =>{
  socket.on('new-user-joined',name =>{
    users[socket.id] = name;
    socket.broadcast.emit('user-joined',name);

  });

  socket.on('send',message =>{
    socket.broadcast.emit('receive',{message: message,name: users[socket.id]})

  });

  socket.on('disconnect',message =>{
    socket.broadcast.emit('left',users[socket.id])

    delete users[socket.id];
  });

})

// START THE SERVER
server.listen(port, () => {
  console.log(`The application started successfully on port ${port}`);
});

