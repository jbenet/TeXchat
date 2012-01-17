define([
  'jquery',
  'underscore',
  'backbone',
  'texchat',
  'util/util',

  'views/chat',
  ], function($, _, Backbone, TeXchat, Util, ChatView) {

// View

var RoomView = Backbone.View.extend({

  el: '#room',

  events: {
    "click #send-btn":   'sendMessage',
    'keyup #send-text':  'onType',
  },

  initialize: function() {
    this.chatView = new ChatView({el: '#chat'});
    this.previewView = new ChatView({el: '#send-preview'});
    // this.userlistView = new UserlistView({model: this.model});
  },

  render: function() {

    // set name
    $(this.el).find('#name').text(this.model.get('name'));

    this.chatView.render();
    this.previewView.render();
    // this.userlistView.render();
  },

  sendMessage: function() {
    var msg = this.message();

    // append message to chat for now.
    if (msg.text)
      this.chatView.appendMessage(msg);

    // clear send box.
    $(this.el).find('#send-text').val('');
    this.previewView.clear();
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

    this.previewView.clear();
    var msg = this.message();
    if (msg.text) {
      this.previewView.appendMessage(msg);
    }
  },

  elSendBox: function() {
    return $(this.el).find('#send-text');
  },

});

return RoomView;
});