var pc = require('paperclip');
var multline = require('multiline');
var path = require('path');
//joined due to strange error when using ./
var BaseController = require(path.join(__dirname, '..', 'base')).BaseController;
var util = require('util');


var menuTemplate = pc.template(multiline(function() {/*
  hello
*/
}));

var selectionTemplate = pc.template(multiline(function() {/*
  
*/
}));


var Controller = function(opt) {
  BaseController.call(this, opt);


};

util.inherits(Controller, BaseController);

module.exports = Controller;




