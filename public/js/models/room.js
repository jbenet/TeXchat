define([
  'jquery',
  'underscore',
  'backbone',
  'util/util',
  ], function($, _, Backbone, Util) {

// View

var RoomModel = Backbone.Model.extend({

  initialize: function() {
    // this.chatView = new ChatView({model: this.model});
    // this.userlistView = new UserlistView({model: this.model});

    console.log(this.get('name'));
    var names = _.range(20)
                 .map(Util.randomName)
                 .map(function (n) { return {id: n}});
    this.users = new Backbone.Collection([], {
      comparator: function(user) {
        return user.get('id').toLowerCase();
      }
    });
  },

});

return RoomModel;
});
