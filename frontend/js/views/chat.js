define([
  'jquery',
  'underscore',
  'backbone',
  'texchat',
  'util/util'
  ], function($, _, Backbone, TeXchat, Util) {

// View

var ChatView = Backbone.View.extend({

  tagName: 'div',
  className: 'chat',

  events: {
  },

  render: function() {

    this.clear();
  },

  clear: function() {
    $(this.el).empty();
  },

  appendMessage: function(message) {
    if (message) {

      // render the message
      var elMsg = $(this.msgTemplate(message));

      // ensure this elem has a uniqueish id, for mathjax
      elMsg.attr('id', 'chat_message_' + Util.randomInt());

      // append the message to our box
      $(this.el).append(elMsg);

      // signal that we've rendered and added this elem (for mathjax, etc)
      Util.rendered(elMsg);
    }
  },

  msgTemplate: _.template('<div class="chat-message">\
      <span class="date"><%- date %></span>\
      <span class="name"><%- name %>:</span>\
      <span class="text"><%- text %></span>\
    </div>\
  '),
  // html-escape all values


});

return ChatView;
});
