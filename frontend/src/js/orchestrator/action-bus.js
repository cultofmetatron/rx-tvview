
//the action Bus is where the components 
//register an action that they are throwing off
////it listens to actions on things registered with it
//things that subscribe to actions will get the stream
//and consequently do stuff with it which then passed to the dispatcher


var rx = require('rx');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var ActionBus = function() {
  EventEmitter.call(this);
  this._stream = new Rx.Subject();
  //creates the internal stream
  Rx.Node.fromEvent(this, 'action').subscribe(this._stream);

};

util.inherits(ActionBus, EventEmitter);


ActionBus.prototype.listenTo = function(actionEmitter) {
  var self = this;
  actionEmitter.on('action', (data)=> {
    self.emit('action', data);
  });
};

Action.prototype.getStream = function() {
  return this._stream;
};




module.exports = ActionBus;
