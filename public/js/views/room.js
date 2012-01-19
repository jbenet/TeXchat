define([
  'jquery',
  'underscore',
  'backbone',
  'texchat',
  'util/util',

  'views/chat',
  'views/userlist',
  'components/cmdinput',
  ], function($, _, Backbone, TeXchat, Util, ChatView, UserlistView, CmdInput) {

// View

var RoomView = Backbone.View.extend({

  el: '#room',

  events: {
    "click #send-btn":   'sendMessage',
    'keyup #send-text':  'onType',
  },

  initialize: function() {
    _.bindAll(this, 'sendMessage', 'onType', 'mentionUser');

    this.chatView = new ChatView({el: '#chat'});
    this.previewView = new ChatView({el: '#send-preview'});
    this.cmdInputView = new CmdInput.View({el: '#send-text'});
    this.userlistView = new UserlistView({
      el: '#users',
      onClickUser: this.mentionUser,
      collection: this.model ? this.model.users : new Backbone.Collection()
    });
  },

  render: function() {

    // set name
    $(this.el).find('#name').text(this.model.get('name'));

    this.chatView.render();
    this.previewView.render();
    this.userlistView.render();

    // for (var i = 0; i < 100; i++) {
    //   this.elSendBox().val('herp ' + i + ' + ' + i + ' = ' + (i+i));
    //   this.sendMessage();
    // }
  },

  sendMessage: function() {
    var msg = this.message();

    // append message to chat for now.
    if (msg.text) {
      this.chatView.appendMessage(msg);

      if (TeXchat.settings('canScroll'))
        Util.scrollToBottom(this.chatView.el, {animate: true});
      TeXchat.view.resize();
    }

    // clear send box.
    this.elSendBox().val('');
    this.previewView.clear();
  },

  message: function() {
    return {
      name: TeXchat.username(),
      text: this.elSendBox().val().trim(),
      date: Util.dateToString(new Date()),
    };
  },

  onType: function(e) {
    var sendText = this.elSendBox().val();

    // enter (without shift)
    if (((e.keyCode || e.which) == 13) && !e.altKey) {
      this.sendMessage();
      this.previewView.clear();
      return false;
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

  mentionUser: function(user) {
    var mention = '@' + user.get('id') + ' ';
    this.elSendBox().val( this.elSendBox().val() + mention);
  }

});

return RoomView;
});