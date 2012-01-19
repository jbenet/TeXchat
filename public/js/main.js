// Filename: main.js

// Require.js allows us to configure mappings to paths
require.config({
  paths: {
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-optamd3-min',
  }
});


require([
  'jquery',
  'underscore',
  'backbone',
  'texchat',

  'util/router',

  'models/room',
  'views/app',

  'protocols/texchat'
  ], function($, _, Backbone, TeXchat, Router,
    RoomModel, AppView, TeXchatProtocol) {

  TeXchat.initialize({ // config
    socketurl: window.location.origin
  });

  TeXchat.room = new RoomModel({name: ''});
  TeXchat.view = new AppView();
  TeXchat.router = new Router();

  TeXchat.protocol = new TeXchatProtocol(TeXchat.config.socketurl, {
    room: TeXchat.room
  });

  if (!Backbone.history.start({pushState: true})) {
    // TeXchat.router.navigate(window.location.pathname.substr(1));
  }

});
