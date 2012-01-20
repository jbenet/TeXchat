define([
  'jquery',
  'underscore',
  'backbone',
  'texchat',

  'libs/bootstrap/bootstrap-modal',
  ], function($, _, Backbone, TeXchat) {



var RoomlistView = Backbone.View.extend({

  template: _.template('\
  <div class="modal-body">\
    <table id="roomlist" class="zebra-striped">\
      <thead><tr><th>Public Room Name</th><th>Users</th></tr></thead>\
    </table>\
    <div style="overflow: auto; height: 500px;">\
      <table>\
        <tbody>\
          <tr><td>Loading...</td><td></td></tr>\
        </tbody>\
      </table>\
    </div>\
  </div>\
  '),

  roomTemplate: _.template('\
  <% rooms.each(function(room) { %>\
    <tr class="room">\
      <td><%- room.get("name") %></td>\
      <td><%- room.get("users") %></td>\
    </tr>\
  <% }); %>\
  '),

  className: 'modal hide fade',

  events: {
    'click tr.room': 'onClickRoom'
  },

  initialize: function() {
    _.bindAll(this, 'onClickRoom');

    this.collection.bind('add', this.renderRooms, this);
    this.collection.bind('remove', this.renderRooms, this);
    this.collection.bind('reset', this.renderRooms, this);
  },

  render: function() {
    // set users

    $(this.el).empty();

    // add modal html
    $(this.el).html(this.template({}));

    // setup modal js
    $(this.el).modal({
      keyboard: true,
      backdrop: true,
    });

    // bind remove upon hiding.
    var that = this;
    $(this.el).bind('hidden', function (e) {
      // e.target.remove();
      that.collection.unbind('add', this.renderRooms);
      that.remove();
    });

    return this;
  },

  renderRooms: function() {

    $(this.el).find('tbody').html(this.roomTemplate({
      rooms: this.collection
    }));

    return this;
  },

  show: function() {
    $(this.el).modal('show');
    return this;
  },

  hide: function() {
    $(this.el).modal('hide');
    return this;
  },

  onClickRoom: function(e) {
    // target = tr.  room is in first td.
    var roomname = $(e.currentTarget).find('td').first().text();
    TeXchat.goToRoom(roomname);
    this.hide();
  }

});

return RoomlistView;
});
