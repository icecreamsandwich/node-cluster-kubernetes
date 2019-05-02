var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var Twit = require('twit');
var favicon = require('serve-favicon');
var port = 5050;
//listen the server

server.listen(port, function(){
    console.log(`server is listening in port ${port}`)
})

app.use(favicon(__dirname + '/public/images/logo.png'))
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
})

var watchList = ['coding', '#coding'];
//var watchList = ['php', 'python', 'node', 'javascript', 'coding', '#coding'];

var T = new Twit({
    consumer_key:'SV7QoHPW0dtfjw6TCI885yf31',
    consumer_secret : 'yvBPocsnR83alEPQiSEiwzgPhF4jiQPTfjxCR2J8zKMbu0rU0Q',
    access_token : '73091059-kC7EzODlfSsGOI7LLGSaIAMi8dig3q57ZW6hpCaUg',
    access_token_secret : 'D8dGZwLFGzgLK2YN4Lm2uMlj6FcmXDCSfa3QPBi9qF9xp'
})
/* //update a status
T.post('statuses/update', {status : 'Hello twitter from socket'}, function(err, data, response){
    console.log('status posted');
    console.log(data);
}) 
//Get follower names of a user
T.get('followers/ids', {screen_name : 'muneebkt'}, function(err, data, response){
    console.log(data);
}) */
// destroy a tweet
/* T.post('statuses/destroy/:id', {id : '1123955119169703936'}, function(err, data, response){
    console.log(data)
}) */

var stream = T.stream('statuses/filter',{track: watchList, language: 'en'});
stream.on('tweet', function(data){
    io.sockets.emit('stream', 
    data.created_at+"\n"+data.text)
}) //data.id+"\n"+
//socket io connection
io.sockets.on('connection', function(socket){
    console.log('socket is open')
})