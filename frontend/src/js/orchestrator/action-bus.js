/*
 *the action Bus is where the components 
 * register an action that they are throwing off
 * it listens to actions on things registered with it
 * things that subscribe to actions will get the stream
 * and consequently do stuff with it which then passed to the dispatcher
 */


var Rx = require('rx');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var ActionBus = function() {
  EventEmitter.call(this);
  this._stream = new Rx.Subject();
  //creates the internal stream, I can leverage the node api
  Rx.Node.fromEvent(this, 'action').subscribe(this._stream);

};

util.inherits(ActionBus, EventEmitter);

//components are given a reference to the action bus 
//if they need to send up actions
ActionBus.prototype.listenTo = function(actionEmitter) {
  var self = this;
  actionEmitter.on('action', function(args) {
    args = Array.prototype.slice.call(arguments);
    self.emit.apply(self, ['action'].concat(args));
  });
  return this;
};

ActionBus.prototype.push = function(action) {
  this.emit('action', action);
  return this;
}

var log = function(val) {
  console.log('actionlog: ', val);
}

//pass it an action stream and it proxies it to its listeners
ActionBus.prototype.proxyStream = function(actionStream) {
  var self = this;
  actionStream
  .map(function(val) {
    log(val)
    return val; //for debugging
  })
  .subscribe(function(value) {
    self.emit('action', value);
  }, function(err) {
    self.emit('error', err);
  });
  return this;
};

ActionBus.prototype.getStream = function() {
  return this._stream;
};




module.exports = ActionBus;
