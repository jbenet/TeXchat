define([
  'jquery',
  'underscore',
  'backbone',
  'texchat',
  'util/util',

  'models/room',
  'views/room',
  'views/roomlist',

  'libs/bootstrap/bootstrap-twipsy',
  'libs/bootstrap/bootstrap-popover',
  ], function($, _, Backbone, TeXchat, Util,
      RoomModel, RoomView, RoomlistView) {

// View

var AppView = Backbone.View.extend({

  el: '#app',

  events: {
    'keyup input#user': 'blurOnEnter',
    'blur input#user':  'changeNameOnBlur',
    'keyup #join':      'gotoOnEnter',
    'resize':           'resize',

    'click a#about': 'onClickAbout',
    'click a#new-private-room': 'newPrivateRoom',
    'click a#new-public-room': 'newPublicRoom',
    'click a#list-public-rooms': 'listPublicRooms',
  },

  initialize: function() {

    this.roomView = new RoomView({ model: TeXchat.room });

  },

  render: function() {

    // fill the username field with selected username.
    $(this.el).find('input#user').val(TeXchat.username());

    // popever explaining the username field
    $(this.el).find('input#user').popover({
      title: function() { return 'Choose your name!'; },
      content: function() { return 'Enter the username above that you wish to '
        + 'use, then press enter. It will be saved for future sessions. '
        + 'Clear the field and press enter to select a random name!'; },
      placement: 'below',
      trigger: 'focus'
    });

    if (!TeXchat.usernameIsUserChosen()) {
      // show popover to prompt username change if randomly selected.
      setTimeout(_.bind(function() {
        $(this.el).find('input#user').popover('show');
      }, this), 2000);
    }

    // popever explaining the join room field
    $(this.el).find('#join').popover({
      title: function() { return 'Enter Room Name.'; },
      content: function() { return 'Enter the room name and press enter.'
        + ' Public rooms can be created just by joining them.'; },
      placement: 'below',
      trigger: 'focus'
    });


    // setup about modal
    $(this.el).find('#about-modal').modal({
      keyboard: true,
      backdrop: true
    });

    // render room subview.
    this.roomView.render();

    // bind events
    $(window).bind('resize', _.bind(this.resize, this));
    $(window).bind('focus', _.bind(this.focus, this));
    this.resize(); // trigger resize event for first time.
  },

  gotoOnEnter: function(e) {
    if ((e.keyCode || e.which) == 13) { // enter

      var room = Util.escape($(this.el).find('#join').val());
      TeXchat.router.navigate('room/' + room, true);
      $(this.el).find('#join').blur();
    }
  },

  blurOnEnter: function(e) {
    if ((e.keyCode || e.which) == 13) { // enter
      $(this.el).find('input#user').blur();
    }
  },

  changeNameOnBlur: function() {
    var username = $(this.el).find('input#user').val();
    if (username == TeXchat.username())
      return; // no name change;

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


  onClickAbout: function() {
    $(this.el).find('#about-modal').modal('show');
  },


  newPrivateRoom: function() {
    TeXchat.goToRoom(Util.randomPrivateRoom());
  },

  newPublicRoom: function() {
    $(this.el).find('#join').focus();
    $(this.el).find('.dropdown-menu').blur();

  },

  listPublicRooms: function(e) {

    var rlv = new RoomlistView({collection: TeXchat.publicRooms});
    rlv.render();
    $(this.el).append($(rlv.el));
    rlv.show();

    TeXchat.protocol.getPublicRooms();

  }

});

return AppView;
});
