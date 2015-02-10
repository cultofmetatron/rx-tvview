var BaseController = require('../base-components/index.js').BaseController;


var pc = require('paperclip');
var multiline = require('multiline');
var path = require('path');
var fs = require('fs');

//joined due to strange error when using ./


var util = require('util');

var templateHtml = '' +
  '<li>' +
  '</li>';


var menuTemplate = pc.template(templateHtml);

//var menuTemplate = pc.template(fs.readFileSync('./templates/selection.tmp'));


var Controller = function(opt) {
  BaseController.call(this, opt);
  this.templates = {
    menu: menuTemplate,
    selection: this.selectionTemplate
  }
};

util.inherits(Controller, BaseController);
module.exports = Controller;




