define([
  'jquery',
  'underscore',
  'backbone',

  'util/util',

  'libs/jquery/jquery.cookie'
  ], function($, _, Backbone, Util) {

var TeXchat = {

  initialize: function(config) {
    this.config = config || {};


    Backbone.sync = function(method, model, options) {
      console.log("calling bogus backbone sync");
      options.success(model.id);
    }

    // prevent submit buttons from reloading the page
    $('form').submit(function(event) {
       event.preventDefault();
       return false;
    });

  },


  go: function(fragment) {
    this.router.navigate(fragment, true);
  },

  cookieOpts: {
    path: '/',
    expires: new Date("2112"),  // hopefully by 2112, js is no longer in use.
  },

  username: function(username) {
    if (_.isString(username)) {

      // escape names
      username = Util.escape(username);

      // set cookie with new name.
      $.cookie("username", username, this.cookieOpts);
    }
    return $.cookie("username") || Util.randomName();
  }


};

window.TeXchat = TeXchat;
return TeXchat;
});


// var socket = io.connect('http://localhost:8080');
