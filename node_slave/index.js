var http = require('http');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var port = 5002;
var app = express();

//using express middlewares
/* app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart()); */

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

app.get('/', function(req, res) {
  //console.log("node slave app runnning !")
  res.send('node slave1 app running ok');
});

// common data (usually taken from mongodb)
let json = {
  movies: [
    {
      title: 'The post',
      path: 'D:Videosmymovie1.mkv',
      size: 24244
    },
    {
      title: 'Transcendence',
      path: 'D:Videosmymovie2.mkv',
      size: 3333
    },
    {
      title: 'Holowman',
      path: 'D:Videosmymovie3.mkv',
      size: 4444
    },
    {
      title: 'Bossbaby',
      path: 'D:Videosmymovie4.mkv',
      size: 5555
    }
  ]
};

//GET request
app.get('/api', function(req, res) {
  res.send(JSON.stringify(json));
});

//POST request
app.post('/api', function(req, res) {
  var movie_title = req.body.movie_title;
  for (const key in json.movies) {
    if (json.movies.hasOwnProperty(key)) {
      if (json.movies[key].title == movie_title) {
        res.send(JSON.stringify(json.movies[key]));
      }
    }
  }
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
