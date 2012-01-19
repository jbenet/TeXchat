define([
  'jquery',
  'underscore',
  'backbone',
  'texchat'
  ], function($, _, Backbone, TeXchat) {

// View



var UserlistView = Backbone.View.extend({

  el: '#users',

  userTemplate: _.template('\
  <li>\
    <span class="prefix transitions"><%- prefix %></span>\
    <span class="name"><%- name %></span>\
  </li>\
  '),

  events: {
    'click li': 'onClickUser'
  },

  initialize: function() {
    _.bindAll(this, 'onClickUser');
  },

  render: function() {
    // set users
    var usersElem = $(this.el);
    usersElem.empty();

    var that = this;
    var markedSelf = false;
    this.collection.each(function (user) {
      var elUser = $(that.userTemplate({
        name: user.get('id'),
        prefix: '>'
      }));

      if (!markedSelf && user.get('id') == TeXchat.username()) {
        elUser.find('.prefix').addClass('self')
        markedSelf = true;
      }

      usersElem.append( elUser );
    });

  },

  onClickUser: function(e) {
    var userid = $(e.target).text();
    var user = this.collection.get(userid);
    if (this.options.onClickUser)
      this.options.onClickUser(user);
  }//,r($(e.target).text()

});

return UserlistView;
});
