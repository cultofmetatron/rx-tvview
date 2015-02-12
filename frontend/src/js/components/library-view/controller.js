var BaseController = require('../base-components/index.js').BaseController;

var path = require('path');
var fs = require('fs');
var $ = require('jquery');
var _ = require('lodash')
var Immutable = require('immutable');



var util = require('util');


//var menuTemplate = pc.template(fs.readFileSync('./templates/selection.tmp'));


var Controller = function(opt) {
  BaseController.call(this, opt);
  this.templates = {
    menu: _.template($('#tmp-library').html())
  };
  this.classes = ['sidemenu']
  this.context = {
    classes: this.classes.join(' ')
  };

  this.subscribe(this.onChange);
  this.render();
};

util.inherits(Controller, BaseController);


Controller.prototype.onChange = function(stream) {
  var self = this;
  return stream
  .filter((val) => {
    console.log('onChange', val)
    return val.store === 'appstate';
  })
  .map((val) => {
    return val.value;
  })
  .subscribe((val) => {
    console.log('selection recieved change event!')
    self.store = Immutable.fromJS(val)
    self.render();
  });
};

Controller.prototype.render = function() {
  var context = this.getContext();
  console.log('rendering', context);
  try {
  var html = this.templates.menu(context);
  } catch (err) {
    html = "";
  }

  this.$el.html(html);
  return this;
}

Controller.prototype.mount = function(domElement) {
  $(domElement).html(this.$el);
  return this;
};



module.exports = Controller;






