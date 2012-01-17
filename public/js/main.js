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

  'views/app',
  ], function($, _, Backbone, TeXchat, Router, AppView) {

  TeXchat.initialize({ // config
  });

  TeXchat.view = new AppView;
  TeXchat.router = new Router();

  if (!Backbone.history.start({pushState: true})) {
    // TeXchat.router.navigate(window.location.pathname.substr(1));
  }

});
