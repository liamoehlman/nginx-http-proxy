var express = require('express')
  , server1 = express()
  , server2 = express()
  , server3 = express();

// set up three servers for the tests

server1.get('/test', function(req, res) {
  console.log('server1 hit')
  res.send('server1');
});

server2.get('/test', function(req, res) {
  console.log('server2 hit')
  res.send('server2');
});

server3.get('/test', function(req, res) {
  console.log('server3 hit')
  res.send('server3');
});

server1.listen(8001);
server2.listen(8002);
server3.listen(8003);