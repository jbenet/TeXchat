define([
  'jquery',
  'underscore',
  'backbone',
  'util/util',
  ], function($, _, Backbone, Util) {

// View

var RoomModel = Backbone.Model.extend({

  initialize: function() {

    // var names = _.range(20)
    //              .map(Util.randomName)
    //              .map(function (n) { return {id: n}});

    this.users = new Backbone.Collection([], {
      comparator: function(user) {
        return user.get('id').toLowerCase();
      }
    });
  },

});

RoomModel.collection = Backbone.Collection.extend({
  model: RoomModel,
  comparator: function(room) {
    return room.get('name').toLowerCase();
  },
});

return RoomModel;
});
