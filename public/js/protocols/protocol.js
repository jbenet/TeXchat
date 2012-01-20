define([
  'underscore',
  'backbone',
  // 'socketio',
  ], function(_, Backbone) {


var extend = _.bind(Backbone.Model.extend, {});

var Protocol = function(socketurl, options) {

  if (!socketurl) {
    throw new Error('Value Error: no socket url provided.');
  }

  _.isString(socketurl) || (socketurl = "" + socketurl)

  this.url = socketurl;
  this.socket = io.connect(socketurl);
  this.options = options || {};
  this.bindSocketEvents();
  this.initialize(options);
};

// extend the Protocol prototype with all inheritable methods.
_.extend(Protocol.prototype, Backbone.Events, {

  initialize: function() {}, // empty initialize function


  // Set callbacks, where `this.events` is a hash of
  //
  // *{"event": "callback"}*
  //
  //     {
  //       'join_room':     'joinedRoom',
  //       'recv_message':  'receivedMessage'
  //     }
  //
  // pairs. The callbacks will be set to fire when the socket receives
  // the corresponding event. Callbacks will be bound to the protocol, with
  // `this` set properly.
  // Based on Backbone.view.delegateEvents
  //
  bindSocketEvents : function(events) {

    if (!(events || (events = this.events)))
      return; // no events? bail

    if (_.isFunction(events))
      events = events.call(this); // function? call it.

    this.unbindSocketEvents(); // get rid of old events.

    for (var event in events) {

      var method = this[events[event]];
      if (!method)
        throw new Error('Event "' + events[event] + '" does not exist');
      method = _.bind(method, this);

      var ev = event + '';
      var that = this;

      // console.log('binding ' + event + ' to ' + events[event]);
      this.socket.on(event, method);
      // this.socket.on(event, function() {
      //   method.apply(that, arguments);
      //   that.trigger(ev);
      // });
    }
  },

  // Clears all callbacks bound to the socket with `bindSocketEvents`
  unbindSocketEvents: function() {
    //TODO
  },


  // shorthand for emitting to the socket.
  emit: function() {
    this.socket.emit.apply(this.socket, arguments);
  },

  // alias for emit.
  send: function() {
    this.emit.apply(this, arguments);
  },


});

// take the extend function from Backbone.
Protocol.extend = Backbone.Model.extend;

Backbone.Protocol = Protocol;
return Protocol;
});