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


Store.prototype.mutate = function(cb) {
  var newVal = this.store.withMutations(cb.bind(this));
  if (newVal !== this.store) {
    this.emit('change', {
      name: this.name,
      value: newVal.toJS();
    });
    this.store = newVal;
  }
  return this;
};

module.exports = Store;


