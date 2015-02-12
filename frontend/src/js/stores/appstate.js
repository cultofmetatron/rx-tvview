
var log = function() { console.log.apply(console, arguments); }


var Store = require('./store');
var util = require('util');
var Immutable = require('immutable');
var _ = require('lodash');
var AppState = function(opts) {
  Store.call(this, opts);
  this.loadInitialState();
  this.mutate((store) => {
    return store.set('initify', 'go');
  })
  setTimeout(() => { this. trigger(); }, 1000)
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
  var activeSelectionIndex = this.store.get('active').get('menu').get('index'); //get the index
  if (this.store.get('menu').size > 0) {
    var library = chunk(_.map(this.store.get('menu').get(activeSelectionIndex).toJS().links, (link) => {
      link.active = false; //explicitly make them false, well reset (THE ONE) after
      return link;
    }, this), CHUNK_SIZE);
    
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
  } else {
    this.mutate((store) => {
      return store.updateIn(['libraryGrid'], () => {
        return Immutable.fromJS([]);
      });
    });
  }
  return this;
};

/* active is a marker of what data is active + what sub movie */

AppState.prototype.loadInitialState = function() {
  var store = {};
  store.menu = require('../../../../data/menu.json').menu
  store.menu[0].active = true; //start focus here
  store.active = {
    menu: { 
      index: 0,
      focused: true
    },
    //movie: null // could also be an array [0, 0]
    movie: null
  };
  this.store = Immutable.fromJS(store);
  this.buildLibraryGrid();
};

AppState.prototype.trigger = function() {
  this.emit('change', {
    name: this.name,
    value: this.store.toJS()
  });
  return this
}

AppState.prototype.moveDown = function() {
  log('moving down');
  var active = this.store.get('active');
  //focus is on the sideMenu, NOT the library view
  if (active.get('movie') === null) {
    //is the menu the index not the last one of the list?
    if (active.get('menu').get('index') < this.store.get('menu').size - 1 ) {
      //increment the menu
      this.mutate((store) => {
        store.updateIn(['active', 'menu', 'index'], (value) => { return value + 1; });
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
      //if the new derivative exists
      var links = this.store.get('menu').get(active.get('menu').get('index')).toJS().links;
      if (links && links[newIndex]){
        this.mutate((store) => {
          //return store.get('menu').get(active.get('menu')).get('links').get(index).set('active', true);
          store.updateIn(['menu', active.get('menu').get('index'), 'links', oldIndex, 'active'], () => {
            return false;
          });
          store.updateIn(['menu', active.get('menu').get('index'), 'links', newIndex, 'active'], () => {
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
  }
  return this;
};

AppState.prototype.moveUp = function() {
  log('moving up')
  var active = this.store.get('active');
  if (active.get('movie') === null) {
    //is the menu not the first one?
    if (active.get('menu').get('index') > 0 ) {
      //increment the menu
      this.mutate((store) => {
        store.updateIn(['active', 'menu', 'index'], (value) => { return value - 1; });
      });
      this.buildLibraryGrid(); //redraw the library
    }
  } else {
    //we check to see if the row is the top one, ie: 0, if not, move it on up
    var libraryGrid = this.store.get('libraryGrid');
    var coordinates = active.get('movie');
    //is the coordinate the bottom row?, check to see if its equal or greater the max size
    if (coordinates.get(0) > 0) {
      var oldIndex = deriveIndex(CHUNK_SIZE, coordinates.get(0), coordinates.get(1));
      var newIndex = deriveIndex(CHUNK_SIZE, coordinates.get(0) - 1, coordinates.get(1));
      this.mutate((store) => {
        //return store.get('menu').get(active.get('menu')).get('links').get(index).set('active', true);
        store.updateIn(['menu', active.get('menu').get('index'), 'links', oldIndex, 'active'], () => {
          return false;
        });
        store.updateIn(['menu', active.get('menu').get('index'), 'links', newIndex, 'active'], () => {
          return true;
        });
        store.updateIn(['active', 'movie', 0], (index) => {
          return index - 1;
        })

        return store;
      });
      this.buildLibraryGrid(); //redraw the library
    }
  }
  return this;
};

AppState.prototype.moveLeft = function() {
  log('moving left')
  var active = this.store.get('active');
  var coordinates = active.get('movie');
  //if the focus is on the menu, then we do nothing
  if (active.get('menu').get('focused')) {
    //do nothing, left like this in case we want to add an action later
  } else {
    coordinates = active.get('movie');
    //is the active item a selection on the far left?
    if (active.get('movie').get(1) === 0) {
      this.mutate((store) => {
        //we switch focus to the menu and set the movie to null
        var activeItemIndex = deriveIndex(CHUNK_SIZE, coordinates.get(0), coordinates.get(1));
        return store
          .updateIn(['active', 'menu', 'focused'], () => {
            return true;
          })
          .updateIn(['active', 'movie'], (value) => {
            return null;
          })
          .updateIn(['menu', active.get('menu').get('index'), 'links', activeItemIndex, 'active' ], () => {
            return false;
          });
      });
      this.buildLibraryGrid(); //redraw the library
    } else {
      //its not so lets move the focus to the item to the left
      var libraryGrid = this.store.get('libraryGrid');
      this.mutate((store) => {
        var activeItemIndex = deriveIndex(CHUNK_SIZE, coordinates.get(0), coordinates.get(1))
        var newIndex = deriveIndex(CHUNK_SIZE, coordinates.get(0), coordinates.get(1) - 1 );
        
        return store
          .updateIn(['active', 'movie', 1], (val) => {
            //update the active cursor
            return val - 1;
          })
          .updateIn(['menu', active.get('menu').get('index'), 'links', activeItemIndex, 'active'], () => {
            return false
          })
          .updateIn(['menu', active.get('menu').get('index'), 'links', newIndex, 'active'], () => {
            //update the new one to true
            return true;
          });
      });
      this.buildLibraryGrid();
    }
  }
  return this;
};

AppState.prototype.moveRight = function() {
  log('moving right');
  var activeSelectionIndex = this.store.get('active').get('menu').get('index'); //get the index
  var active = this.store.get('active');
  var coordinates = active.get('movie');
  //if the focus is on the menu, then we switch focus to the right menu
  if (active.get('menu').get('focused') && 
     (this.store.get('menu').get(activeSelectionIndex).toJS().links.length > 0)) {
    this.mutate((store) => {
      //unfocus the menu, and set the view to 0, 0
      return store
        .updateIn(['active', 'menu', 'focused'], () => {
          return false;
        })
        .updateIn(['active', 'movie'], () => {
          return Immutable.fromJS([0, 0]);
        })
        .updateIn(['menu', active.get('menu').get('index'), 'links', 0, 'active'], () => {
          return true;
        });
    });
    this.buildLibraryGrid();
  } else if(active.get('movie') !== null) {
    // if the item is not all the way to the right
    var oldIndex = deriveIndex(CHUNK_SIZE, coordinates.get(0), coordinates.get(1));
    var newIndex = deriveIndex(CHUNK_SIZE, coordinates.get(0), coordinates.get(1) + 1);

    if (active.get('movie').get(1) < (CHUNK_SIZE - 1) && 
       (this.store.get('menu').get(active.get('menu').get('index')).get('links').toJS()[newIndex])) {
      this.mutate((store) => {
        return store
          .updateIn(['active', 'movie', 1], (val) => {
            //increment the second coordinate coordinate
            return val + 1;
          })
          .updateIn(['menu', active.get('menu').get('index'), 'links', oldIndex, 'active'], (active) => {
            return false;
          })
          .updateIn(['menu', active.get('menu').get('index'), 'links', newIndex, 'active'], (active) => {
            return true;
          });
      });
      this.buildLibraryGrid();
    }
  }
  return this;
};

//method to be run when the input comes in
AppState.prototype.onInput = function(type) {
  (({
    up: this.moveUp,
    down: this.moveDown,
    left: this.moveLeft,
    right: this.moveRight,
    //enter: this.moveRight
  
  })[type] || function() {}).call(this);
};



module.exports = AppState;


