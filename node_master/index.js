var http = require('http');
var ip = require('ip');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var path = require('path');
var config = require('dotenv').config();
var socket = require('socket.io');
var Twit = require('twit');

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
  /* var now = new Date();
  res.send(
    'Node master application' +
      now.toISOString() +
      ' on container port ' +
      port +
      ' with ip ' +
      ip.address()
  ); */
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.post('/home', function(req, res) {
  var now = new Date();
  res.send(
    'Node master application' +
      now.toISOString() +
      ' on container port ' +
      port +
      ' with ip ' +
      ip.address()
  );
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
  var tags_mod = tags ? tags.split(',') : '';
  var car_id = req.body.car_id;

  var postData = {
    name: name,
    address: address,
    tags: tags_mod,
    address_detaills: {
      address2: address2,
      map_location: map_location,
      pincode: pincode
    },
    rank_detaills: {
      mark: mark,
      position: position
    },
    car_id: car_id
  };
  // console.log(JSON.stringify(postData));
  var host = process.env.NODE_SLAVE2 || 'http://localhost:5003';
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
      //  console.log(body);
      res.send(body);
    }
  });
});

//send a POST request to fetch data node slave2 app
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
      // console.log(body);
      res.send(body);
    }
  });
});

//POST to update a document
app.post('/db/update', function(req, res) {
  var name = req.body.name;
  var address = req.body.address;
  var tags = req.body.tags;
  var address2 = req.body.address2;
  var map_location = req.body.map_location;
  var pincode = req.body.pincode;
  var mark = req.body.mark;
  var position = req.body.position;
  var tags_mod = tags ? tags.split(',') : '';

  var postData = {
    name: name,
    address: address,
    tags: tags_mod,
    address_detaills: {
      address2: address2,
      map_location: map_location,
      pincode: pincode
    },
    rank_detaills: {
      mark: mark,
      position: position
    },
    _id: req.body._id
  };
  //console.log(JSON.stringify(postData));
  var host = process.env.NODE_SLAVE2 || 'http://localhost:5003';
  var options = {
    method: 'POST',
    body: JSON.stringify(postData),
    uri: host + '/db/update',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  request(options, function(error, response, body) {
    if (error) {
      console.error('error:', error);
    } else {
      //    console.log('Response: Headers:', response && response.headers);
      //    console.log(body);
      res.send(body);
    }
  });
});

//POST request to delete a document
app.post('/db/delete', function(req, res) {
  var host = process.env.NODE_SLAVE2 || 'http://localhost:5003';
  var postData = {
    _id: req.body._id
  };
  var options = {
    method: 'POST',
    body: JSON.stringify(postData),
    uri: host + '/db/delete',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  request(options, function(error, response, body) {
    if (error) {
      console.error('error:', error);
    } else {
      //  console.log('Response: Headers:', response && response.headers);
      res.send(body);
    }
  });
});

//TODO practicing aggregation in mongodb
app.post('/db/aggregate', function(req, res) {
  var host = process.env.NODE_SLAVE2 || 'http://localhost:5003';
  var options = {
    method: 'POST',
    uri: host + '/db/aggregate',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  request(options, function(err, response, body) {
    if (err) console.error('error :' + err);
    else {
      console.log(body);
      res.send(body);
    }
  });
});

//TODO call socket connection to get twitter stream
app.post('/socket_twitter', function(req, res){
   var T = new Twit({
      consumer_key: 'SV7QoHPW0dtfjw6TCI885yf31',
      consumer_secret : 'yvBPocsnR83alEPQiSEiwzgPhF4jiQPTfjxCR2J8zKMbu0rU0Q',
      access_token : '73091059-kC7EzODlfSsGOI7LLGSaIAMi8dig3q57ZW6hpCaUg',
      access_token_secret : 'D8dGZwLFGzgLK2YN4Lm2uMlj6FcmXDCSfa3QPBi9qF9xp'
   })
   var stream = T.stream('statuses/filter', {track : 'javascript'});
    stream.on('tweet',function(data){
      console.log(data);
      res.send(data);
    });
});

app.listen(port, function() {
  console.log(`node master app listening on port ${port}!`);
});
