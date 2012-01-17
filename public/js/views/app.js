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
    'blur input#user': 'changeNameOnBlur',
    'keyup #join':     'gotoOnEnter'
  },

  initialize: function() {

    this.roomView = new RoomView({});

  },

  render: function() {

    $(this.el).find('input#user').val(TeXchat.username());

    this.roomView.render();
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
  }

});

return AppView;
});
