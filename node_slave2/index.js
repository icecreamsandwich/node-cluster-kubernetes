var http = require('http');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017'; // Replace this ip with one of the nodes in docker swarm
var ObjectID = require('mongodb').ObjectID;

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
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db('test');
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
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
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

//POST request to udpate a document from mongodb
app.post('/db/update', function(req, res) {
  var myObj = req.body;
  var user_id = req.body._id;
  delete myObj._id;

  try {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
      var dbo = db.db('test');
      dbo
        .collection('customers')
        .updateOne({ _id: ObjectID(user_id) }, { $set: myObj }, function(
          err,
          resdb
        ) {
          if (err) {
            console.log(err);
          } else {
            console.log('document updated successfully');
            res.send('document updated successfully');
          }
        });
      db.close();
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

//POST request to delete a document
app.post('/db/delete', function(req, res) {
  var user_id = req.body._id;
  console.log(user_id);
  try {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      var dbo = db.db('test');
      dbo
        .collection('customers')
        .deleteOne({ _id: ObjectID(user_id) }, function(err, resdb) {
          if (err) throw err;
          console.log('document deleted successfully');
          res.send('document deleted successfully');
          db.close();
        });
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`node slave2 app is listening on port ${port}`);
});
