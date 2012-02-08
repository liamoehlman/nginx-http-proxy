var proxy = require('../lib/proxy.js')
  , assert = require('assert')
  , nginx = new proxy('/test/');

describe('Methods', function() {
  it('Should add the route the rules object', function(done) {
    nginx.add({'localhost' : 8000}, '/test', function() {
      assert.equal(nginx.rules['/test'][0], 'localhost:8000', 'rule does not seem to be added');
      done();
    });
  });

  it('Should delete the route from the rules object', function(done) {
    nginx.del({'localhost' : 8000}, '/test', function() {
      assert.equal(typeof nginx.rules['/test'], 'undefined', 'rule still exists, delete failed');
      done();
    });
  });

  it('Should only remove one route from the rules object', function(done) {
    nginx.add({'localhost' : 8000, '127.0.0.1' : 8001}, '/test', function() {
      assert.equal(nginx.rules['/test'][0], 'localhost:8000', 'Both rules not added')
      assert.equal(nginx.rules['/test'][1], '127.0.0.1:8001', 'Both rules not added')    
      nginx.del({'localhost' : 8000}, '/test', function() {
        assert.equal(nginx.rules['/test'], '127.0.0.1:8001', 'Failure to delete rule ' + nginx.rules);
        done();
      });
    });
  });
});