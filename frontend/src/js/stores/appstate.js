
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

var CHUNK_SIZE = 4;

var chunk = function(arr, len) {
  var chunks = [];
  var i = 0;
  var n = arr.length;
  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }
  return chunks;
};

//given a coordinate pair and chunk size, return the INDEX if it was dechunked
var deriveIndex = function(chunkSize, i, j) {
  return (i * chunkSize) + j
};


//rebuilds the grid from the library data
AppState.prototype.buildLibraryGrid = function() {
  var activeSelectionIndex = this.store.get('active').get('menu'); //get the index
  var library = chunk(_.map(this.store.get('menu').get(activeSelectionIndex).get('links').toJS(), (link) => {
    link.active = false; //explicitly make them false, well reset (THE ONE) after
    return link;
  }, this), CHUNK_SIZE);
  
  /* if a movie is specified in focus, then we shold mark it as active */
  var coordinates = this.store.get('active').get('movie');
  if (coordinates) {
    library[coordinates.get(0)][coordinates.get(1)]['active'] = true;
  }
  debugger
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
    //movie: null // could also be an array [0, 0]
    movie: [0, 1]
  };
  this.store = Immutable.fromJS(store);
  this.buildLibraryGrid();
};

AppState.prototype.moveDown = function() {
  var active = this.store.get('active');
  //focus is on the sideMenu, NOT the library view
  if (active.get('movie') === null) {
    //is the menu the index not the last one of the list?
    if (active.get('menu') < this.store.get('menu').size - 1 ) {
      //increment the menu
      this.mutate((store) => {
        store.updateIn(['active', 'menu'], (value) => { return value + 1; });
      });
      this.buildLibraryGrid(); //redraw the library
    }
  } else {
    //we check to see if the row is the bottom most and move it down
    var libraryGrid = this.store.get('libraryGrid');
    var coordinates = active.get('movie');
    //is the coordinate the bottom row?, check to see if its equal or greater the max size
    if (coordinates.get(0) < libraryGrid.size - 1) {
      var oldIndex = deriveIndex(CHUNK_SIZE, coordinates.get(0), coordinates.get(1));
      var newIndex = deriveIndex(CHUNK_SIZE, coordinates.get(0) + 1, coordinates.get(1));
      this.mutate((store) => {
        //return store.get('menu').get(active.get('menu')).get('links').get(index).set('active', true);
        store.updateIn(['menu', active.get('menu'), 'links', oldIndex, 'active'], () => {
          return false;
        });
        store.updateIn(['menu', active.get('menu'), 'links', newIndex, 'active'], () => {
          return true;
        });
        store.updateIn(['active', 'movie', 0], (index) => {
          return index + 1;
        })

        return store;
      });
      this.buildLibraryGrid(); //redraw the library
    }
  }
  return this;
};

AppState.prototype.moveUp = function() {

};

AppState.prototype.moveLeft = function() {

};

AppState.prototype.moveRight = function() {

};

//method to be run when the input comes in
AppState.prototype.onInput = function(type) {
  this.mutate((store) => {
    
  
  });
};



module.exports = AppState;


