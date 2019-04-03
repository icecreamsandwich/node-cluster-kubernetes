var http = require('http');
var ip = require('ip');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var config = require('dotenv').config();
const port = 5001;

var app = express();

app.get('/', function(req, res) {
  var now = new Date();
  res.send('Node master application' + now.toISOString() + ' on container port ' + port + ' with ip ' + ip.address())
 // res.send('Node master application');
});

//send a GET request to node slave and get response
app.get('/api', function(req, res) {
  // res.send("API endpoint")
  var host = process.env.NODE_SLAVE || 'http://localhost:5002';
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
      var ipObj = {'pod_ip': ip.address()}
      res.send(body+ipObj);
    }
  });
});

//send a POST request to node slave and get response
app.post('/api', function(req, res) {
  let postData = {
    movie_title: 'Transcendence'
  };
  var host = process.env.NODE_SLAVE || 'http://localhost:5002';
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

//send a POST request to node slave2 app
app.post('/db/fetch', function(req, res) {
  var host = process.env.NODE_SLAVE2 || 'http://localhost:5003';
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
