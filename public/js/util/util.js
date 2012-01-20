define([
  'underscore',
  'backbone',
  'libs/jquery/jquery.sha1',
  ], function(_, Backbone) {

var Util = {

  dateToString: function(date) {
    return date.toISOString().replace('T', ' ').split('.')[0];
  },

  randomName: function () {

    var names = ['Isaac', 'Albert', 'Neils', 'Charles', 'Louis', 'Sigmund', 'Galileo', 'Antoine Laurent', 'Johannes', 'Nicolaus', 'Michael', 'James Clerk', 'Claude', 'Franz', 'Werner', 'Linus', 'Rudolf', 'Erwin', 'Ernest', 'Paul', 'Andreas', 'Tycho', 'Ludwig', 'Max', 'Marie', 'William', 'Charles', 'Pierre Simon', 'Edwin', 'Joseph', 'Max', 'Francis', 'Enrico', 'Leonard', 'Justus', 'Arthur', 'William', 'Marcello', 'Christiaan', 'Carl', 'Albrecht', 'August', 'Robert', 'Murray', 'Emil', 'Dmitri', 'Sheldon', 'James', 'John', 'John von', 'Richard', 'Alfred', 'Stephen', 'Anton', 'Max', 'Gustav', 'Hans', 'Gregor', 'Heike', 'Thomas', 'Hermann', 'Paul', 'Ernst', 'Charles', 'Theodosius', 'Max', 'Jean Baptiste', 'William', 'Noam', 'Frederick', 'John', 'Louis Victor', 'Carl', 'Jean', 'George', 'Claude', 'Lynn', 'Karl', 'Konrad', 'Edward', 'Frederick', 'Gertrude', 'Hans', 'J. Robert', 'Edward', 'Willard', 'Ernst', 'Jonas', 'Emil', 'Trofim', 'Francis', 'Alfred', 'Alexander', 'Wilhelm'];

    return names[ Util.randomInt(3) % names.length ];
  },


  randomHelpText: function() {
    var text = [
      'Hold the alt key to bypass keyboard shortcuts (enter, up, down).',
      'Press up or down to move through previous commands.',
      'Enter math between $ signs. Like so: $ 1 + 1 $.',
      'Enter math using any valid MathJax syntax.',
      'Press Alt + Enter to insert a line break.',
      'Public rooms are listed. Private rooms can only be accessed by link.',
      'Click a username to insert an @mention.',
    ];
    return text[ Util.randomInt(3) % text.length ];
  },


  randomInt: function(order) {
    return Math.round(Math.random() * Math.pow(10, order || 5));
  },

  // escape resource names (turning odd chars into -)
  escape : function(str) {
    str = str.trim();
    str = str.replace(/['"`]/g, '');          // remove quotes
    str = str.replace(/[^A-Za-z0-9]/g, '-');  // unallowed chars => -
    str = str.replace(/--+/g, '-');           // reduce --+ -> -
    return str.replace(/^-+|-+$/g, '');       // trim - at either end.
  },


  // link_re: /(http:\/\/)([^ <>]*)/g,
  link_re: /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i,

  rendered: function(selector) {

    var html = $(selector).html().trim();

    // honor carriage returns.
    html = html.replace(/\n/g, '<br />');

    html = html.replace(/\@[A-Za-z0-9-]+/g, "<span class='mention'>$&</span>");

    // process any links
    html = html.replace(this.link_re,
      "<a target='_blank' href='http://$1'>$&</a>");

    $(selector).html(html);


    // process any tex
    try {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, $(selector).attr('id')]);
    } catch (err) {
      if (err.type != 'not_defined')
        console.log(err);
    }

    return $(selector);
  },

  scrollToBottom: function(selector, options) {
    options = _.extend({}, options);

    var prop = {scrollTop: $(selector).prop('scrollHeight') };
    if (options.animate) {
      $(selector).stop();
      $(selector).animate(prop);
    } else {
      $(selector).prop(prop);
    }
  },

  _rateLimitData: {},
  rateLimit: function(callback, ms) {
    ms || (ms = 300);

    var last = this._rateLimitData[callback];
    if (last && (new Date() - last < ms)) {
      // console.log('rate limited');
      return;
    }

    callback();
    this._rateLimitData[callback] = new Date();
  },


  randomPrivateRoom: function() {
    return $.sha1((new Date()).toISOString() + 'TeXchat' + Util.randomInt(4));
  },

  isPrivateRoom: function(roomname) {
    return roomname.length == Util.randomPrivateRoom().length;
  }

};

return Util;

});
