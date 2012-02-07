var httpProxy = require('http-proxy')
  , proxyServer;

var options = {
  router : { 
    'localhost/test' : 'localhost:8001/test1'
  }
}

proxyServer = httpProxy.createServer(options);

proxyServer.listen(80);