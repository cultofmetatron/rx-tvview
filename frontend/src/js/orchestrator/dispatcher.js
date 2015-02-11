
var Rx = require('rx');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Dispatcher = function() {
  EventEmitter.call(this);
  this._stream = new Rx.Subject();
  //creates the internal stream, I can leverage the node api
  Rx.Node.fromEvent(this, 'update').subscribe(this._stream);
};

util.inherits(Dispatcher, EventEmitter);



//stores push changes through this interface
Dispatcher.prototype.push = function(storeName, value) {
  this.emit(event, {
    store: storeName,
    value: value
  });
  return this;
};

Dispatcher.prototype.listenTo = function(store) {
  var self = this;
  store.on('change', function(store) {
    self.push(store.get('name'), store.getValue());
  });
  return this;
};


module.exports = Dispatcher;






