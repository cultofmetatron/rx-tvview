
var Store = require('./store');
var util = require('util');

var AppState = function(opts) {
  Store.call(this, opts);
};

util.inherits(AppState, Store);

/*
 * The menu has 2 types of data
 *  1: the selection: the button we are selected on
 *  2: library items
 *
 *  when booting up the app, we can focus on the first
 *  element of the menu and set ist links for the active links
 */

//rebuilds the grid from the library data
AppState.prototype.buildLibraryGrid = function() {

};

AppState.prototype.loadInitialState = function() {
  var store = {};
  store.menu = require('../../../../data/menu.json').menu
  store.menu[0].active = true; //start focus here
  store.active = ['menu', 0];
  

};

//method to be run when the input comes in
AppState.prototype.onInput = function(type) {
  this.mutate((store) => {
    
  
  });
};



module.exports = AppState;


