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
  this.$el = jQuery(options.el || '<div></div>');

  this.templates = options.templates;
  this.store = Immutable.Map(this.transform(_.isObject(options.initialState) ? options.initialState : {}));
};

util.inherits(BaseController, EventEmitter);

//allows us to chain in the event flow through a stream;
BaseController.prototype.subscribe = function(cb) {
  cb.call(this, this.dispatcher.getStream());
  return this;
};

BaseController.prototype.set = function(property, value) {
  var newStore = this.store.set(property, value);
  if (newStore === this.store) {
    this.emit('change', {
      timestamp: Date.now(),
      oldVal: this.store,
      newVal: newStore
    });
    this.store = newStore;
  }
  return this;
};

//to be overridden
BaseController.prototype.transform = function(val) {
  return val;
}

BaseController.prototype.get = function(property) {
  return this.store.get(property);
};

BaseController.prototype.getContext = function() {
  return this.store.toJS();
};

//given a calback, the callback is given the dispatch stream
BaseController.prototype.addResponder = function(cb) {
  cb.call(this, this.dispatcher, this);
  return this;
};

module.exports.BaseController = BaseController;


