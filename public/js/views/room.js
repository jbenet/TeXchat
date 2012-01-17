define([
  'jquery',
  'underscore',
  'backbone',
  ], function($, _, Backbone) {

// View

var RoomView = Backbone.View.extend({

  el: '#room',

  events: {
    "click #send-btn": 'sendMessage',
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

  sendMessage: function() {

  }

});

return RoomView;
});