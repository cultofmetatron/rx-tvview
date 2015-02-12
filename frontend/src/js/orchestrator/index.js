/*
 * The orchestator organizes components and chooses which 
 * applications recieve which events
 */
var path = require('path');

var ActionBus  = require('./action-bus');
var Dispatcher = require('./dispatcher');
var Store      = require('./store');

module.exports = function() {
  console.log('booting up the orchestrator');
  //create the dispatcher and action-bus;
  var actionBus = new ActionBus();
  var dispatcher = new Dispatcher();

  var appState = new Store('appState', {
    menu: require('../../../../data/menu.json').menu,
  });

  //Objective 1, get the sidebar menu activated
  var selection = new (require('../components/selection').Controller)({
    actionBus: actionBus,
    dispatcher: dispatcher,
    initialState: {
      menu: appState.store.get('menu')
    }
  });

  selection.mount('.side-panel')

};






