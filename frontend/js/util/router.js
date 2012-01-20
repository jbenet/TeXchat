define([
  'underscore',
  'backbone',

  'models/room',
  'views/room',
  ], function(_, Backbone, RoomModel, RoomView) {

var Router = Backbone.Router.extend({

  routes: {
    "": "home",
    "room/:room": "room",
  },

  home: function() {
    this.navigate('room/home');
  },

  room: function(roomname) {
    roomname = roomname || "home";

    TeXchat.view.roomView.model.clear();
    TeXchat.protocol.joinRoom(roomname);

    TeXchat.view.roomView.render();

  }

});

return Router;
});
