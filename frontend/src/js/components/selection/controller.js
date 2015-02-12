var BaseController = require('../base-components/index.js').BaseController;


var pc = require('paperclip');
var multiline = require('multiline');
var path = require('path');
var fs = require('fs');
var jQuery = require('jquery');
var _ = require('lodash')
var Immutable = require('immutable');
//joined due to strange error when using ./


var util = require('util');

  

//var menuTemplate = pc.template(fs.readFileSync('./templates/selection.tmp'));


var Controller = function(opt) {
  BaseController.call(this, opt);
  this.templates = {
    menu: pc.template(templateHtml).view(this.initialState)
  }

  this.subscribe(this.onChange);
  this.render();
};

util.inherits(Controller, BaseController);

Controller.prototype.onChange = function(stream) {
  var self = this;
  stream
  .filter((val) => {
    return val.name === 'appState'
  })
  .map((val) => {
    return val.value();
  })
  .subscribe((val) => {
    self.store = Immutable(val)
    self.render();
  });
};

Controller.prototype.render = function() {
  var context = this.getContext();
  console.log('context', context);
  return this.templates.menu.setProperties(context);
}

Controller.prototype.mount = function(domElement) {
  jQuery(domElement).html(this.templates.menu.render());
  return this;
};







module.exports = Controller;




