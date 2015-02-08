
//must bring in the treaceur runtime or things break. 
require('traceur/bin/traceur-runtime');


console.log('hello world');

var input = require('./lib/input');


input.upKey.subscribe(function(ev) {
  console.log('keypress up');
});

input.downKey.subscribe(function(ev) {
  console.log('keypress down');
})

input.leftKey.subscribe(function(ev) {
  console.log('keypress left');
})

input.rightKey.subscribe(function(ev) {
  console.log('keypress right');
})

input.enterKey.subscribe(function(ev) {
  console.log('keypress enter');
})

