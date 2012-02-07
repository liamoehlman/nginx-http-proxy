var express = require('express')
  , server1 = express.createServer()
  , server2 = express.createServer()
  , server3 = express.createServer();

// set up three servers for the tests

server1.get('/test1', function(req, res) {
  res.send('server1');
});

server2.get('/test2', function(req, res) {
  res.send('server2');
});

server3.get('/test3', function(req, res) {
  res.send('server3');
});

server1.listen(8001);
server2.listen(8002);
server3.listen(8003);
