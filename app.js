var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var useragent = require('express-useragent');
var expressValidator    = require('express-validator')
    util                 = require('util');

const cors = require('cors')
app.use(cors())
path= require('path');
appRoot= __dirname;

app.use(useragent.express());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended:true})); // support encoded bodies

app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,token');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});


app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        fld_nm : formParam,
        msg_tx   : msg,
        spld_vl : value
      };
    }
}));

app.use(logErrors);
app.use('/nodeapp', require('./routes/routes'));

function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

app.get('/', function(req, res) {
    res.send("Sample Mongoos API Server");
});


var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Mongoos API Server is listening at http://%s:%s', host, port);
});
