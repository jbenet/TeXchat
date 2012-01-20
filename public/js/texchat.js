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
      $.cookie("rusername", "", this.cookieOpts);
    }

    // user chosen, or randomly assigned name
    var username = $.cookie("username") || $.cookie("rusername");
    if (!username) {
      // if no history, randomly assign a new name.
      $.cookie("rusername", Util.randomName(), this.cookieOpts);
      username = $.cookie("rusername");
    }
    return username
  },

  // settings defaults
  _settings: {
    'canScroll': true
  },
  settings: function (key, value) {
    if (value !== undefined) {
      this._settings[key] = !!value;
    }
    return this._settings[key];
  },

  sysmsg: function(msg) {
    this.view.roomView.recvMessage({
      name: '',
      date: Util.dateToString(new Date()),
      text: msg
    })
  },

  Util: Util,
};

window.TeXchat = TeXchat;
return TeXchat;
});
