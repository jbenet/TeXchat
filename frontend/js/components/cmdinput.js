define([
  'jquery',
  'underscore',
  'backbone',
  'texchat',
  'util/util',
  ], function($, _, Backbone, TeXchat, Util) {

// View

var CmdInput = {};

CmdInput.Commands = Backbone.Collection.extend({

  initialize: function() {
    // bind our methods, to avoid "_.bind(this.something, this)"
    _.bindAll(this, 'isDirty', 'reset', 'curr', 'prev', 'next');

    // listen for changes and reset iteration.
    this.bind('add', this.reset);
    this.bind('remove', this.reset);

    // initialize pointer to undefined (not dirty).
    this._curr = undefined;
  },

  isDirty: function() {
    return !_.isUndefined(this._curr);
  },

  reset: function() {
    this._curr = undefined;
  },

  curr: function() {
    return this.at(this._curr);
  },

  hasPrev: function() {
    if (!this.isDirty()) {
      // have not begun iteration. no prev.
      return false;
    }


    if (this.length - 1 == this._curr) {
      // reached the end. cannot keep going.
      this.reset();
      return false;
    }

    return true;
  },

  prev: function() {
    if (!this.hasPrev()) {
      return undefined;
    }

    // move pointer back, return that element.
    this._curr += 1;
    return this.curr();
  },

  hasNext: function() {
    if (this.length == 0) {
      // empty. cannot iterate.
      // this.reset(); // should not be necessary.
      return false;
    }

    if (this._curr <= 0) {
      // worked our way all the way back. reset, return no.
      return false;
    }

    return true;
  },

  next: function() {
    if (!this.hasNext()) {
      return undefined;
    }

    if (!this.isDirty()) {
      // have not begun iteration. set _curr to "before first elem".
      this._curr = this.length;
    }

    // move pointer fwd, return that element.
    this._curr -= 1;
    return this.curr();
  },

});


CmdInput.View = Backbone.View.extend({

  tagName: 'input',

  events: {
    'keyup':  'onType',
  },

  initialize: function() {
    _.bindAll(this, 'onType');
    this.cmds = new CmdInput.Commands();
  },

  render: function() {
  },

  ignoreKBEvent: function(event) {
    return event.altKey;
  },

  _lastEvent: undefined,
  _currentCmd: '',
  onType: function(e) {
    // bug: events firing twice!?
    if (e == this._lastEvent)
      return;
    this._lastEvent = e;

    if (this.ignoreKBEvent(e))
      return;

    var text = $(this.el).val();
    if (!this.cmds.isDirty()) {
      // we're at the beginning, store this in temp buffer
      this._currentCmd = text;
    }

    switch ((e.keyCode || e.which)) {

      case 38: // up
        if (this.cmds.hasNext()) {
          $(this.el).val(this.cmds.next().get('cmd'))
        }
        break;

      case 40: // down
        if (this.cmds.hasPrev()) {
          $(this.el).val(this.cmds.prev().get('cmd'))
        } else {
          $(this.el).val(this._currentCmd);
        }
        break;

      case 13: // enter
        var text = $(this.el).val().trim();
        this.cmds.add({cmd: text});
    }


    // preview text for anything typed in (enter ought to clear it).
    // if (this.options.onType)
    //   this.options.onType(e);
  },

});

return CmdInput;
});
