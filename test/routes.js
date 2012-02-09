var proxy = require('../lib/proxy.js')
  , assert = require('assert')
  , path = require('path')
  , nginx = new proxy(path.join(__dirname, '/nginx'));

function include(arr, item) {
  return (arr.indexOf(item) != -1);
}

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
      console.log(nginx.rules);
      nginx.update();
      done()
    });
  })
});