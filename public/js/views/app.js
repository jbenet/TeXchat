define([
  'jquery',
  'underscore',
  'backbone',
  'texchat',
  'util/util',

  'models/room',
  'views/room',

  ], function($, _, Backbone, TeXchat, Util, RoomModel, RoomView) {

// View

var AppView = Backbone.View.extend({

  el: '#app',

  events: {
    'keyup input#user': 'blurOnEnter',
    'blur input#user':  'changeNameOnBlur',
    'keyup #join':      'gotoOnEnter',
    'resize':           'resize',
  },

  initialize: function() {

    this.roomView = new RoomView({ model: TeXchat.room });

  },

  render: function() {

    $(this.el).find('input#user').val(TeXchat.username());

    this.roomView.render();

    $(window).bind('resize', _.bind(this.resize, this));
    $(window).bind('focus', _.bind(this.focus, this));
    this.resize();
  },

  gotoOnEnter: function(e) {
    if ((e.keyCode || e.which) == 13) { // enter

      var room = Util.escape($('#join').val());
      TeXchat.router.navigate('room/' + room, true);
    }
  },

  blurOnEnter: function(e) {
    if ((e.keyCode || e.which) == 13) { // enter
      $(this.el).find('input#user').blur();
    }
  },

  changeNameOnBlur: function() {
    var username = $(this.el).find('input#user').val();
    username = TeXchat.username(username);
    $(this.el).find('input#user').val(username);

    TeXchat.protocol.setName();
  },

  resize: function() {
    // set the chat height proportionally.
    var height = document.height - 460;
    $(this.el).find('#chat').css('height', height + 'px');
  },

  focus: function() {

    // refresh name. may have changed in another window.
    var username = TeXchat.username();
    if (username != $(this.el).find('input#user').val()) {
      $(this.el).find('input#user').val(username);
      TeXchat.protocol.setName();
    }
    Util.rateLimit(TeXchat.protocol.roomInfo, 500);
  },

});

return AppView;
});
