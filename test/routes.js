var proxy = require('../lib/proxy.js')
  , assert = require('assert')
  , path = require('path')
  , request = require('request')
  , fs = require('fs')
  , exec = require('child_process').exec
  , spawn = require('child_process').spawn
  , nginx = new proxy(path.join(__dirname, '/nginx'))
  , server;

function include(arr, item) {
  return (arr.indexOf(item) != -1);
}

before(function() {
  // replace the nginx config with a basic one
  var nginxConf = path.join(__dirname, 'nginx', 'conf', 'nginx.conf');
  var nginxStartup = fs.readFileSync(path.join(__dirname, 'files', 'nginx.startup'), 'utf8');

  fs.unlink(nginxConf, function(err) {
    if (err) {}

    fs.writeFileSync(nginxConf, nginxStartup, 'utf8');
    // start nginx
    exec('nginx -p ' + path.join(__dirname, '/nginx/'), function(err, stdout, stderr) {
      if (err) {
        console.log(err);
      }
    });
    // start the test server
    server = spawn('node', [path.join(__dirname, 'server', 'server.js')]);
  });
});

after(function() {
  // kill nginx
  var pid = fs.readFileSync(path.join(__dirname, 'nginx', 'logs', 'nginx.pid'));
  exec('kill ' + pid, function(err, stdout, stderr) {
    if (err) {
      console.log(err);
    }
  });
  server.kill('SIGTERM');
});

describe('Methods', function() {
  it('Should add the route the rules object', function(done) {
    nginx.add(['localhost:8000'], 'test', function() {
      var hosts = nginx.rules[0].hosts;
      assert.equal(true, include(hosts, 'localhost:8000'), 'rule does not seem to be added');
      done();
    });
  });

  it('Should delete the route from the rules object', function(done) {
    nginx.del(['localhost:8000'], 'test', function() {
      assert.equal(nginx.rules.length, 0, 'rule still exists, delete failed');
      done();
    });
  });

  it('Should only remove one route from the rules object', function(done) {
    nginx.add(['localhost:8000', '127.0.0.1:8001'], 'test', function() {
      var hosts = nginx.rules[0].hosts;
      assert.equal(true, include(hosts, 'localhost:8000'), 'Both rules not added');
      assert.equal(true, include(hosts, '127.0.0.1:8001'), 'Both rules not added'); 
      // remove only one rule
      nginx.del(['localhost:8000'], 'test', function() {
        hosts = nginx.rules[0].hosts
        assert.equal(true, include(hosts, '127.0.0.1:8001'), 'Wrong rule removed');
        assert.equal(false, include(hosts, 'localhost:8000'), 'Rule still present');
        // reset the routes for the next test
        nginx.rules = [];
        done();
      });
    });
  });
  
  it('Should output an updated config', function(done) {
    nginx.add(['localhost:8001', 'localhost:8002', 'localhost:8003'], 'test', function(){
// TODO -- Use diff to determine if the generated config is diffenent to the one on file
      nginx.update(function(err) {
        if (err) {
          done();
        } else {
          exec('diff -q ' + path.join(__dirname, '/nginx', 'conf', 'nginx.conf') + ' ' + path.join(__dirname, 'diff', 'nginx.conf') , function(err, stdout, stderr) {
            if (stdout) {
              done(new Error('Difference in expected and actual configs'));
            } else {
              done();
            }
          });
        }
      });
    });
  });

  it('Should reload the nginx config to have the additional routes', function(done) {
    var responses = ['server1', 'server2', 'server3'];
    
    this.timeout(6000);
    request('http://localhost', function(err, resp, body) {
      if (err) {
        done(err)
      } else if (body != 'default') {
        console.log(body);
        done(new Error('something is funky with the config'));
      } else {
        nginx.reload(function(err) {
          if (err) {
            done(err);
          } else {
            // make three requests to the server, remove the response from the array
            setTimeout(function(){
              for (var ii = 3; ii > 0; ii--) {
                request('http://localhost/test', function(err, resp, body) {
                  if (include(responses, body)) {
                    responses.splice(responses.indexOf(body), 1);
                  }
                  if (responses.length === 0) {
                    done();
                  }
                });
              }  
            }, 5000)
          }
        });
      }
    });

  });
});
