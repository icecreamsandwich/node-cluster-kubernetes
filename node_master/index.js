var http = require('http');
var ip = require('ip');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var config = require('dotenv').config();
const port = 5001;

var app = express();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

app.get('/', function(req, res) {
  var now = new Date();
  res.send(
    'Node master application' +
      now.toISOString() +
      ' on container port ' +
      port +
      ' with ip ' +
      ip.address()
  );
  // res.send('Node master application');
});

//send a GET request to node slave and get response
app.get('/api', function(req, res) {
  // res.send("API endpoint")
  var host = process.env.NODE_SLAVE || 'http://slave1:5002';
  var options = {
    method: 'GET',
    uri: host + '/api',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  request(options, function(error, response, body) {
    if (error) {
      console.error('error:', error);
    } else {
      console.log('Response: Headers:', response && response.headers);
      console.log(body);
      var ipObj = { pod_ip: ip.address() };
      res.send(body + ipObj);
    }
  });
});

//send a POST request to node slave and get response
app.post('/api', function(req, res) {
  let postData = {
    movie_title: 'Transcendence'
  };
  var host = process.env.NODE_SLAVE || 'http://slave1:5002';
  var options = {
    method: 'POST',
    uri: host + '/api',
    body: JSON.stringify(postData),
    headers: {
      'Content-Type': 'application/json'
    }
  };
  request(options, function(error, response, body) {
    if (error) {
      console.error('error:', error);
    } else {
      console.log('Response: Headers:', response && response.headers);
      console.log(body);
      res.send(body);
    }
  });
});

//send a POST request to save data node slave2 app
app.post('/db/save', function(req, res) {
  var name = req.body.name;
  var address = req.body.address;
  var tags = req.body.tags;
  var address2 = req.body.address2;
  var map_location = req.body.map_location;
  var pincode = req.body.pincode;
  var mark = req.body.mark;
  var position = req.body.position;
  var postData = {
    name: name,
    address: address,
    tags: [tags],
    address_detaills : {
      address2:address2,
      map_location:map_location,
      pincode:pincode,
    },
    rank_detaills : {
      mark:mark,
      position:position,
    },
  };
  console.log(JSON.stringify(postData));
  var host = process.env.NODE_SLAVE2 || 'http://slave2:5003';
  var options = {
    method: 'POST',
    body: JSON.stringify(postData),
    uri: host + '/db/save',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  request(options, function(error, response, body) {
    if (error) {
      console.error('error:', error);
    } else {
      console.log('Response: Headers:', response && response.headers);
      console.log(body);
      res.send(body);
    }
  });
});

//send a POST request to fetch data node slave2 app
app.post('/db/fetch', function(req, res) {
  var host = process.env.NODE_SLAVE2 || 'http://slave2:5003';
  var options = {
    method: 'POST',
    uri: host + '/db/fetch',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  request(options, function(error, response, body) {
    if (error) {
      console.error('error:', error);
    } else {
      console.log('Response: Headers:', response && response.headers);
      console.log(body);
      res.send(body);
    }
  });
});

app.listen(port, function() {
  console.log(`node master app listening on port ${port}!`);
});
