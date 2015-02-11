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
  this.dispatcher = options.templates;
  //regsiter the action bus to listen to this
  if (!options.actionBus) { throw new Error('actionBus not specified!!'); }
  this.actionBus.listenTo(this);

  this.templates = options.templates;
  this.storage = Immutable.map(_.isObject(options.initialState) ? options.initialState : {});
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


module.exports.BaseController = BaseController;


