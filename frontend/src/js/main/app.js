
//must bring in the treaceur runtime or things break. 
require('traceur/bin/traceur-runtime');
var $ = require('jquery');
$("body").css("overflow", "hidden");
$(document).ready(require('../orchestrator'));


