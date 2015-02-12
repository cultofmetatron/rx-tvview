
var Store = require('./store');
var util = require('util');
var Immutable = require('immutable');
var _ = require('lodash');
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

var chunk = function(arr, len) {
  var chunks = [];
  var i = 0;
  var n = arr.length;
  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }
  return chunks;
};


//rebuilds the grid from the library data
AppState.prototype.buildLibraryGrid = function() {
  var activeSelectionIndex = this.store.get('active').get('menu'); //get the index
  var library = chunk(_.map(this.store.get('menu').get(activeSelectionIndex).get('links').toJS(), (link) => {
    link.active = false; //explicitly make them false, well reset (THE ONE) after
    return link;
  }, this), 4);
  
  /* if a movie is specified in focus, then we shold mark it as active */
  var coordinates = this.store.get('active').get('movie');
  if (coordinates) {
    library[coordinates.get(0)][coordinates.get(1)]['active'] = true;
  }
  this.mutate((store) => {
    return store.updateIn(['libraryGrid'], () => {
      return Immutable.fromJS(library);
    });
  });
};

/* active is a marker of what data is active + what sub movie */

AppState.prototype.loadInitialState = function() {
  var store = {};
  store.menu = require('../../../../data/menu.json').menu
  store.menu[0].active = true; //start focus here
  store.active = {
    menu: 0,
    movie: null // could also be an array [0, 0]
  };
  this.store = Immutable.fromJS(store);
  this.buildLibraryGrid();
};

AppState.prototype.moveDown = function() {
  var active = this.store.get('active');
  if (active.get('movie') === null) {
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


