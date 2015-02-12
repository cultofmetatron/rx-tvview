/*
 * this object is a set of streams that can be subscribed to
 * forworking with the minimal interface.
 *
 * up, down, left, right, enter
 *
 */

var Rx = require('rx');
var _ = require('lodash');
var keyupStream = Rx.Observable.fromEvent(document, 'keyup');

var keydownStream = Rx.Observable.fromEvent(document, 'keydown');

//add additional key commands here
var inputs = {
  'left': 37,
  'right': 39,
  'down': 40,
  'up': 38,
  'enter': 13
};


//helper method for creating the individual streams
var createPressStream = function(inputType) {
  if (_.isUndefined(inputType)) { throw new Error('input type undefined');}
  return keydownStream.sample(keyupStream)
  .map(function(event) {
    //console.log(event.keyCode) //why does this code run multiple times?
    return event.keyCode;
  })
  .filter(function(code) {
    return code === inputs[inputType];
  })
 };

var inputStreams = {}
_.each(_.keys(inputs), function(inputType) {
  //we set up a subject proxy so that we can have multiple subscribers
  var msgProxy = new Rx.Subject();
  createPressStream(inputType)
  .map(function(code) {
    return {
      type: 'input',
      key: inputType
    };
  })
  .subscribe(msgProxy);
  inputStreams[inputType + 'Key'] = msgProxy;
});

module.exports = inputStreams;




