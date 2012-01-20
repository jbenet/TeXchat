define([
  'underscore',
  'backbone',
  'texchat',
  'protocols/protocol',
  ], function(_, Backbone, TeXchat, Protocol) {


var TeXchatProtocol = Protocol.extend({


  events: {
    'chatMessage':  'onReceivedMessage',
    'joinedRoom': 'onJoinedRoom',
    'userJoined': 'onUserJoined',
    'userParted': 'onUserParted',
    'roomInfo':   'onRoomInfo',
    'rename': 'onRename',
    'resync': 'onResync',
  },

  initialize: function() {
    _.bindAll(this, 'setName', 'joinRoom', 'roomInfo', 'partRoom');
    _.bindAll(this, 'sendMessage');

    this.room = this.options.room;
  }, // empty initialize function

  setName: function() {
    this.send('setName', TeXchat.username());
  },

  joinRoom: function(room) {

    if (this.room.get('name') == room)
      return; // already here

    this.room.set({
      'name': room
    });
    this.send('joinRoom', room);
    this.send('roomInfo', room);
  },

  // request room information update.
  roomInfo: function(room) {
    room || (room = this.room.get('name'));
    this.send('roomInfo', room);
  },

  partRoom: function(room) {
    if (!room)
      room = this.room.get('name');

    this.room.clear();

    if (room)
      this.send('partRoom', room);
  },

  sendMessage: function(room, message) {
    if (room && !message) {
      message = room;
      room = this.room.get('name');
    }

    this.assertInRoom(room);

    this.send('chatMessage', room, message);
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

    TeXchat.sysmsg(user + ' joined room ' + room);
  },

  onUserParted: function(room, user) {
    console.log(user + ' parted room ' + room);
    this.assertInRoom(room);

    this.room.users.remove(user);
    TeXchat.sysmsg(user + ' parted room ' + room);
  },

  onReceivedMessage: function(room, message) {
    console.log('room ' + room + ' received ' + message);
    this.assertInRoom(room);

    this.room.trigger('receivedMessage', message);
  },

  onResync: function() {
    TeXchat.go('room/' + room);
  },

  onRename: function(room, oldname, newname) {
    this.room.users.remove({ id: oldname });
    this.room.users.add({ id: newname });
    TeXchat.sysmsg(oldname + ' is now known as ' + newname);
  }

});


return TeXchatProtocol;
});
