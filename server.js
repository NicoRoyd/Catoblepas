const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const exphbs = require('express-handlebars');

// set MongoDB
const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/garage');
const db = mongoose.connection;

const home = require('./routes/homeRouter');
var mygarage = require('./routes/mygarageRouter');

// Init App
const app = express();

// set static folders
app.use(express.static('public'));
app.use(express.static('node_modules'));
//app.use(express.static('routes'));


// set view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  layoutsDir: 'views',
  defaultLayout: 'home'
}));
app.set('view engine', 'handlebars');

// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// express validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      //value: value
    };
  }
}));

// set routes handlers
app.use('/', home);
app.use('/mygarage', mygarage);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});