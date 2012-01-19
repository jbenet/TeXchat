define([
  'underscore',
  'backbone',
  'texchat',
  'protocols/protocol',
  ], function(_, Backbone, TeXchat, Protocol) {


var TeXchatProtocol = Protocol.extend({


  events: {
    'joinedRoom': 'onJoinedRoom',
    'userJoined': 'onUserJoined',
    'userParted': 'onUserParted',
    'roomInfo':   'onRoomInfo',
    'onRecvMsg':  'onReceivedMessage',
  },

  initialize: function() {
    this.room = this.options.room;
  }, // empty initialize function


  joinRoom: function(room) {

    if (this.room.get('name'))
      return; // already here

    this.partRoom();

    this.room.set({
      'name': room
    });
    this.send('joinRoom', room);
  },

  partRoom: function(room) {
    if (!room)
      room = this.room.get('name');

    this.assertInRoom(room);

    this.room.clear();
    this.send('partRoom', room);
  },

  sendMessage: function(room, message) {
    if (room && !message) {
      message = room;
      room = this.room.get('name');
    }

    this.assertInRoom(room);

    this.send('sendMessage', room, message);
  },


  assertInRoom: function(room) {
    if (room != this.room.get('name'))
      throw new Error('Not currently in room ' + room);
  },


  onRoomInfo: function(room, info) {
    console.log('room ' + room + ' information ' + info);
    this.assertInRoom(room);

    this.room.set({name: info.name});

    var users = _.map(info.users, function(user) {
      return {name: user, id: user};
    });

    this.room.users.reset(users);
  },

  onJoinedRoom: function(room) {
    console.log('joined room ' + room);
    // this.assertInRoom(room);

    TeXchat.go('room/' + room);
  },

  onUserJoined: function(room, user) {
    console.log(user + ' joined room ' + room);
    this.assertInRoom(room);

    this.room.users.add({ id: user });
  },

  onUserParted: function(room, user) {
    console.log(user + ' parted room ' + room);
    this.assertInRoom(room);

    this.room.users.remove(user);
  },

  onReceivedMessage: function(room, message) {
    console.log('room ' + room + ' received ' + message);
    this.assertInRoom(room);

    this.room.trigger('receivedMessage', message);
  },

});


return TeXchatProtocol;
});
