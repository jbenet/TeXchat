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

    this.model.bind('receivedMessage', this.recvMessage, this);
  },

  render: function() {

    // set name
    var roomname = this.model.get('name');
    $(this.el).find('#name').text(roomname);
    $(this.el).find('#status').text(
      Util.isPrivateRoom(roomname) ? 'private' : 'public'
    )

    this.chatView.render();
    this.previewView.render();
    this.userlistView.render();
    // this.renderRandomMessage();

    // for (var i = 0; i < 100; i++) {
    //   this.elSendBox().val('herp ' + i + ' + ' + i + ' = ' + (i+i));
    //   this.sendMessage();
    // }

  },

  renderRandomMessage: function() {
    $(this.el).find('#send-help').text(Util.randomHelpText());
  },

  recvMessage: function(msg) {

    // append message to chat for now.
    if (msg.text) {
      this.chatView.appendMessage(msg);

      if (TeXchat.settings('canScroll'))
        Util.scrollToBottom(this.chatView.el, {animate: true});
      TeXchat.view.resize();
    }

  },

  sendMessage: function() {
    var msg = this.message();

    if (msg.text)
      TeXchat.protocol.sendMessage(msg);

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

      this.renderRandomMessage();

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
    if (!user)
      return;

    var mention = '@' + user.get('id') + ' ';
    this.elSendBox().val( this.elSendBox().val() + mention);
  }

});

return RoomView;
});