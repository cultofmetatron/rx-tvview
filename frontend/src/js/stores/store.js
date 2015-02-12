var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Rx = require('rx');
var Immutable = require('immutable');

var Store = function(options) {
  EventEmitter.call(this);
  this.name = options.name;
  this.store = Immutable.Map(options.state || {});
  //only dispatcher subscribe so no need for multiple broadcasts
  this._stream = Rx.Node.fromEvent(this, 'update');
};
util.inherits(Store, EventEmitter);

//use to register what to do on an action.
//it gets passed the action bus where we can work from there
Store.prototype.onAction = function(actionBus, cb) {
  cb.call(this, actionBus.getStream(), this);
};

//not all actions result in mutation and I wanted this to 
//reflect that
Store.prototype.mutate = function(cb) {
  var newVal = this.store.withMutations(cb.bind(this));
  debugger
  if (newVal !== this.store) {
    this.emit('change', {
      name: this.name,
      value: newVal.toJS()
    });
    this.store = newVal;
  }
  return this;
};

module.exports = Store;


