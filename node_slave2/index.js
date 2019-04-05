var http = require('http');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://192.168.1.200:27017';

var port = 5003;
var app = express();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

app.get('/', function(req, res) {
  res.send('node slave2 app running ok');
});

//POST to insert data to mongoDB
app.post('/db/save', function(req, res) {
  var myobj = req.body;
  try {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db('test');
      // var myobj = { name: 'Company Inc', address: 'Highway 37' };
      dbo.collection('customers').insertOne(myobj, function(err, resdb) {
        if (err) throw err;
        console.log('1 document inserted');
        res.send('1 document inserted');
        db.close();
      });
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

//POST request to retrieve data from mongodb
app.post('/db/fetch', function(req, res) {
  try {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db('test');
      dbo
        .collection('customers')
        .find({})
        .toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        });
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.listen(port, () => {
  console.log(`node slave2 app is listening on port ${port}`);
});
