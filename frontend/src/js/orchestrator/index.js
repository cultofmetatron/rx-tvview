/*
 * The orchestator organizes components and chooses which 
 * applications recieve which events
 */
var path = require('path');
var _ = require('lodash');
var ActionBus  = require('./action-bus');
var Dispatcher = require('./dispatcher');
var Store      = require('../stores/store');
var AppState   = require('../stores/appstate');


module.exports = function() {
  console.log('booting up the orchestrator');
  //create the dispatcher and action-bus;
  var actionBus = new ActionBus();
  var dispatcher = new Dispatcher();
  var input = require('../lib/input');

  _.each(['up', 'down', 'left', 'right', 'enter'], function(button) {
    actionBus.proxyStream(input[button + 'Key'])
  });
  

  var appState = new AppState({
    name: 'appstate',
    //state: { menu: require('../../../../data/menu.json').menu }
  });

  window.appState = appState

  dispatcher.listenTo(appState);

  
  appState.onAction(actionBus, function(stream, store) {
    return stream
    .filter((val) => {
      return val.type === 'input';
    })
    .subscribe((val) => {
      this.onInput(val.key)
    });
  });


  //Objective 1, get the sidebar menu activated
  var selection = new (require('../components/selection').Controller)({
    actionBus: actionBus,
    dispatcher: dispatcher,
    name:'selection menu',
    initialState: {}
  });

  var library = new(require('../components/library-view/controller'))({
    actionBus: actionBus,
    dispatcher: dispatcher,
    name:'library-view',
    initialState: {}
  })

  
  selection.mount('.side-panel')
  library.mount('.main-panel')




};






