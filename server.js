var express = require('express');
var socketio = require('socket.io');
var _ = require('underscore');

var app = express.createServer();
var io = socketio.listen(app);

app.listen(8080);


// routing
app.configure(function() {
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
});

app.configure(function() {
  app.use(express.static(__dirname + '/frontend'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


app.get('/room/:room', function (req, res) {
  req.url = '/';
  req.next();
  // res.redirect('/#' + req.url);
});



// chat stuff.

var chat = io.of('/chat');
var users = {};

chat.on('connection', function (socket) {

  var user = { name: '', room: undefined};
  users[socket.id] = user;

  // change name
  socket.on('setName', function(name) {

    var oldname = user.name;
    user.name = name;
    if (user.room) {
      chat.in(user.room)
          .emit('rename', user.room, oldname, name);
    }

  });


  socket.on('getPublicRooms', function() {

    var cleanName = function(key) { return key.replace(/\/chat\/?/gi, ''); }

    var rooms = _(chat.manager.rooms || {})
                // room object with user count.
                .map(function(v, k) { return {name: k, users: v.length }; })
                // remove the /chat/ prefix.
                .map(function(r) { r.name = cleanName(r.name); return r; })
                // filter out empty string
                .filter(function(r) { return r.name.length > 0; })
                // filter out private rooms (sha1 hashes)
                .filter(function(r) { return r.name.length != 40; })

    socket.emit('publicRooms', rooms);

  });

  function leaveRoom() {
    // leave previous room
    if (user.room) {

      socket.leave(user.room);
      chat.in(user.room)
          .emit('userParted', user.room, user.name);
      user.room = undefined;

    }
  }


  // join a room
  socket.on('joinRoom', function(roomname) {

    if (user.room)
      leaveRoom();


    user.room = roomname;
    socket.join(roomname);
    socket.emit('joinedRoom', roomname);

    chat.in(user.room)
        .emit('userJoined', roomname, user.name);
  });

  // send room info
  socket.on('roomInfo', function(roomname) {
    var usernames = _(chat.manager.rooms['/chat/' + roomname] || [])
                    // .filter(function(s) { return s != socket.id; })
                    .map(function(s) { return users[s].name; });

    socket.emit('roomInfo', roomname, {name: roomname, users: usernames});
  });

  // join a room
  socket.on('partRoom', function(roomname) {
    leaveRoom();
  });


  // message
  socket.on('chatMessage', function(roomname, message) {
    if (roomname != user.room) {
      console.log(new Error('Attempting to broadcast to channel not in.'));
      socket.emit('resync');
      return;
    }

    // console.log(roomname + ' saw ' + message);
    message.date = new Date().toISOString().replace('T', ' ').split('.')[0];
    chat.in(roomname).emit('chatMessage', roomname, message);
  });


	// when the user disconnects.. perform this
	socket.on('disconnect', function() {

    // leave room.
    leaveRoom(socket);

	});
});
