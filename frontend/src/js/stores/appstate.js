
var Store = require('./store');
var util = require('util');
var Immutable = require('immutable');

var AppState = function(opts) {
  Store.call(this, opts);
  this.loadInitialState();
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
  //do this later
};

/* active is a marker of what data is active + what sub component */

AppState.prototype.loadInitialState = function() {
  var store = {};
  store.menu = require('../../../../data/menu.json').menu
  store.menu[0].active = true; //start focus here
  store.active = {
    menu: 0,
    component: null // could also be an array [0, 0]
  };
  this.store = Immutable.fromJS(store);
  this.buildLibraryGrid();
};

AppState.prototype.moveDown = function() {
  var active = this.store.get('active');
  if (active.get('component') === null) {
    //is the menu the index not the last one of the list?
    if (active.get('menu') < this.store.get('menu').size - 1 ) {
      //increment the menu
      this.mutate((store) => {
        store.updateIn(['active', 'menu'], (value) => { return value + 1; })
      });
      this.buildLibraryGrid(); //redraw the library
    }
  } else {
    //we check to see if the row is the bottom most and move it down
    var activeLibrary = this.store.get('libraryGrid');
  }
};

//method to be run when the input comes in
AppState.prototype.onInput = function(type) {
  this.mutate((store) => {
    
  
  });
};



module.exports = AppState;


