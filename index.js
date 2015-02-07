console.log('Booting up App');
var path = require('path');
var express = require('express');
var app = express();


app.set('view engine', 'jade');
app.set('views', [path.join(__dirname, 'views')]);






app.listen(process.env.PORT || 3000);
