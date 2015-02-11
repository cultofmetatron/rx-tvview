
var rx = require('rx');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Dispatcher = function() {
  EventEmitter.call(this);

};

util.inherits(Dispatcher, EventEmitter);

Dispatcher.prototype.observeEvent = function(event) {
  
};



module.exports = Dispatcher;






