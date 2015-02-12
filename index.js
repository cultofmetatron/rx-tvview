console.log('Booting up App');
var path = require('path');
var express = require('express');
var app = express();


app.set('view engine', 'jade');
app.set('views', [path.join(__dirname, 'views')]);


app.use('/js', express.static(path.join(__dirname, 'frontend', 'build', 'js')))
app.use('/styles', express.static(path.join(__dirname, 'frontend', 'build' , 'stylesheets')));
app.use('/img', express.static(path.join(__dirname, 'images')))

app.get('/', function(req, res, next) {
  res.status(200).render('app', {});
});

console.log('listening on port ', process.env.PORT || 3000)
app.listen(process.env.PORT || 3000);
