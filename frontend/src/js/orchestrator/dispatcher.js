
var Rx = require('rx');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Dispatcher = function() {
  EventEmitter.call(this);
  this._stream = new Rx.Subject();
  //creates the internal stream, I can leverage the node api
  Rx.Node.fromEvent(this, 'change').subscribe(this._stream);

};

util.inherits(Dispatcher, EventEmitter);

Dispatcher.prototype.getStream = function() {
  return this._stream;
}

//stores push changes through this interface
Dispatcher.prototype.push = function(storeName, value) {
  this.emit('change', {
    store: storeName,
    value: value
  });
  return this;
};


Dispatcher.prototype.listenTo = function(store) {
  var self = this;
  store.on('change', function(storeData) {
    console.log('pickeup a change from: ', storeData);
    self.push(storeData.name, storeData.value);
  });
  return this;
};


module.exports = Dispatcher;






