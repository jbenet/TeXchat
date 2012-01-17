define([
  'jquery',
  'underscore',
  'backbone',
  'texchat',
  'util/util'
  ], function($, _, Backbone, TeXchat, Util) {

// View

var RoomView = Backbone.View.extend({

  el: '#room',

  events: {
    "click #send-btn":   'sendMessage',
    'keyup #send-text':  'onType',
  },

  initialize: function() {
    // this.chatView = new ChatView({model: this.model});
    // this.userlistView = new UserlistView({model: this.model});
  },

  render: function() {

    // set name
    $(this.el).find('#name').text(this.model.get('name'));

    // this.chatView.render();
    // this.userlistView.render();
  },

  msgTemplate: _.template('<div class="chat-message">\
      <span class="date"><%- date %></span>\
      <span class="name"><%- name %>:</span>\
      <span class="text"><%- text %></span>\
    </div>\
  '),
  // html-escape all values

  sendMessage: function() {

    // clear send box.
    $(this.el).find('#send-text').val('');
  },

  message: function() {
    return {
      name: TeXchat.username(),
      text: this.elSendBox().val(),
      date: Util.dateToString(new Date()),
    };
  },

  onType: function(e) {
    if ((e.keyCode || e.which) == 13) { // enter = send message
      this.sendMessage();
    }
    // preview text for anything typed in (enter ought to clear it).
    var html = this.elSendBox().val() ? this.msgTemplate(this.message()) : '';
    this.elSendPreview().html(html);
    Util.rendered(this.elSendPreview());
  },

  elSendBox: function() {
    return $(this.el).find('#send-text');
  },

  elSendPreview: function() {
    return $(this.el).find('#send-preview');
  }

});

return RoomView;
});