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

    // TeXchat.view.roomView.remove();
    TeXchat.view.roomView.model.clear();
    TeXchat.view.roomView.model.set({name: roomname || "home"});

    TeXchat.view.render();

  }

});

return Router;
});
