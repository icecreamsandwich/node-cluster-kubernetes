var http = require('http');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
//In localhost
//var url = 'mongodb://192.168.1.107:47017';
// Replace this ip with one of the nodes in docker swarm
var url =
  'mongodb://192.168.1.107:37017;mongodb://192.168.1.107:27017;mongodb://192.168.1.107:47017;mongodb://192.168.1.107:57017/admin?replicaSet=rs0';
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

//TODO practicing aggregation in mongodb
app.post('/db/aggregate', function(req, res) {
  try {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      else {
        var dbo = db.db('test');
        dbo
          .collection('cars')
          .find({})
          .sort({ id: -1 })
          //limit 50 offset 70
          .skip(70)
          .limit(50)
          .toArray(function(err, resdb) {
            if (err) console.log(err);
            console.log(resdb);
            res.send(JSON.stringify(resdb));
            db.close();
          });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`node slave2 app is listening on port ${port}`);
});

// All operations

/* .aggregate([
            {
              $project : { car_vin :1}
            }
          ]) */
/* .aggregate([
           { 
            $match:{
              car_make : {$regex: '^Volks'}
            }
          },
          {
            $project :{ _id : 1, car_make : 1, car_model : 1 }
          },
            {
              $group:{
                 _id :{ car_make : "$car_make"},
                 car_models :{$push : "$car_model"}
              }
            },
             {
              $count: "cars starting with 'Volks'"
            } 
          ]) */
//find a perfect match
/*  .aggregate(
            {$match : {
              car_make: 'Volkswagen',
            }},
        ) */
//find a perfect match && a condition
/*  .find({
            car_make: 'Volkswagen',
            id : {$gt:10}
          }) */
//find records with and condition
/*  .find({
             $and : [
              {id: {$lt: 70}},
              {id: {$gt: 50}} ,              
            ], 
            //find records with or condition
          //  $or: [{ id: 90 }, { id: 80 }]
          //find records with IN condition
           //   id : {$in : [62,65]}
          })  */
//aggregate with join with another table
/* .aggregate([
            {
              $lookup: {
                from: 'customers',
                localField: 'id',
                foreignField: 'car_id',
                as: 'customerdetails'
              }
            }
          ]) */
/* .find({
            price : {$lt :300}
          })*/

//More aggregations
/* .find({
            //car_make : 'Saab'
           // car_make :{$regex : '^Sat'}
           //car_make :{ $regex : 'he$'}
          }) */
/* .aggregate([
            {
              $project: {
                id: 1,
                car_make: 1,
                car_model: 1,
                car_price: 1
              }
            }
          ]) */
/* .find({
            car_make : {$regex: 'he$'},
            
          }) */
/* .aggregate([
            {
              $project :{
                id:1, car_make :1 ,car_model :1 
              },           
            },
           // {$count : 'car_make_total_count'}
          ]) */
/* .aggregate([
            {
              $match: {
                car_make: { $regex: 'he$' }
              }
            },
             {
              $count: "cars name ending with 'he' count"
            } 
          ]) */

//aggregate group by
/* .aggregate([
           { 
            $match:{
              car_make : {$regex: '^Volks'}
            }
          },
            {
              $group:{
                _id :{ car_make : "$car_make"},
                  count :{$sum : 1}
              }
            }
          ]) */
