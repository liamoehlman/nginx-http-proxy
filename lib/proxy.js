var Nginx = module.exports = exports = function(confDir) {
  this.conf = confDir
  this.rules = {}
}

// add the rule to the routes object
Nginx.prototype.add = function(hosts, source, callback) {
  var add = this;

  if (! this.rules[source]) {
    add.rules[source] = []
    // push all the hosts into the rule
    Object.keys(hosts).forEach(function(host) {
      add.rules[source].push(host + ':' + hosts[host]);
    });
    
    callback();  
  } else {
    Object.keys(hosts).forEach(function(host) {

      for (var ii = 0; ii < add.rules[source].length; ii++) {
        // check for the existance of an existing rule in the array
        if (!(add.rules[source][ii] === (host + ':' + hosts[host]))) {
          add.rules[source].push(host + ':' + hosts[host]);
        } // if
      } // for
    });
    callback();
  } // if...else
} // add

// remove the route form the rules object
Nginx.prototype.del = function(hosts, source, callback) {
  var del = this;

  if (! this.rules[source]) {
    callback(new Error('No such route')); 
  } else {
    Object.keys(hosts).forEach(function(host) {
      for (var ii = 0; ii < del.rules[source].length; ii++) {
      // check for the existance of an existing rule in the array
        if ((del.rules[source][ii] === (host + ':' + hosts[host]))) {
          del.rules[source].splice(ii, 1);
        } // if
      } // for
    });

    if (del.rules[source].length == 0) {
      delete del.rules[source];
    } // if
    callback(null);
  } // if...else
} // del

Nginx.prototype.update = function(callback) {
    
}