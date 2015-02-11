var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Rx = require('rx');
var Immutable = require('immutable');

var Store = function(name, state) {
  EventEmitter.call(this);
  this.name = name;
  this.store = Immutable.Map(state || {});

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


