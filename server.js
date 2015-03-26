var http = require("http"),
  express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('error-handler')
  fs = require('fs-extra');
var mkdirp = require('mkdirp');
var path = require('path');     //used for file path
var ObjectID = require('mongodb').ObjectID;

var db = require('mongojs').connect('localhost/maps', ['items']);
var server = express();

// Config
server.use(bodyParser());
server.use(methodOverride());

server.use(express.static(__dirname));

server.get('/query/:term', function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  db.items.find({type: req.params.term}, function(err, items) { // Query in MongoDB via Mongo JS Module
    if( err || !items) {
      console.log("No items found");
      res.status(400).send();
      next();
    } else {
      res.writeHead(200, {'Content-Type': 'application/json'}); // Sending data via json
      str='[';
      items.forEach( function(item) {
        var date = item.date;
        str = str + '{ "type" : "' + item.type + 
          '", "name" : "' + item.name +
          '", "x" : "' + item.x + 
          '", "y" : "' + item.y +
          '"},' + '\n';
      });
      str = str.trim();
      str = str.substring(0, str.length-1);
      str = str + ']';
      res.end( str );
        // prepared the JSON array here
    }
  });
});

var port = 8180;
server.listen(port, function() {
  console.log('server listening on port ' + port);
});