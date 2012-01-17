define([
  'jquery',
  'underscore',
  'backbone',
  ], function($, _, Backbone) {

// View

var RoomModel = Backbone.Model.extend({

  initialize: function() {
    // this.chatView = new ChatView({model: this.model});
    // this.userlistView = new UserlistView({model: this.model});

    console.log(this.get('name'));
  },

});

return RoomModel;
});
