/*
 * these controllers will be event handlers for data comming
 * in. they will then update the internal state of the dom
 * appropriatly through the tamplte
 */

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var _ = require('lodash');
var Immutable = require('immutable');

var BaseController = function(options) {
  if (!options.dispatcher) { throw new Error('dispatcher not specified!!'); }
  this.dispatcher = options.dispatcher;
  //regsiter the action bus to listen to this
  if (!options.actionBus) { throw new Error('actionBus not specified!!'); }
  this.actionBus = options.actionBus
  this.actionBus.listenTo(this);

  this.templates = options.templates;
  this.storage = Immutable.Map(_.isObject(options.initialState) ? options.initialState : {});
};

util.inherits(BaseController, EventEmitter);

//allows us to chain in the event flow through a stream;
BaseController.prototype.subscribe = function(observable, args) {
  args = Array.prototype.slice.call(arguments, 1);
  observable.subscribe.apply(observable, _.map(args, function(fn) {
    return fn.bind(this);
  }, this));
  return this;  //for chaining purposes
};

BaseController.prototype.set = function(property, value) {
  var newStore = this.storage.set(property, value);
  if (newStore === this.storage) {
    this.emit('change', {
      timestamp: Date.now(),
      oldVal: this.storage,
      newVal: newStore
    });
    this.storage = newStore;
  }
  return this;
};

BaseController.prototype.get = function(property) {
  return this.storage.get(property);
};

BaseController.prototype.getContext = function() {
  return this.storage.toJS();
};

//given a calback, the callback is given the dispatch stream
BaseController.prototype.addResponder = function(cb) {
  cb.call(this, this.dispatcher, this);
  return this;
};

module.exports.BaseController = BaseController;


