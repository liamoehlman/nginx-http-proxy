var handlebars = require('handlebars')
  , fs = require ('fs')
  , path = require('path')
  , exec = require('child_process').exec

var Nginx = module.exports = exports = function(dir) {
  this.dir = dir;
  this.rules = []
}

function include(arr, item) {
  return (arr.indexOf(item) != -1);
}

// add the rule to the routes object
Nginx.prototype.add = function(hosts, source, callback) {
  var add = this
    , exists = false;

  for (var ii = 0; ii < add.rules.length; ii++) {
    // flag if there is already an entry fro the new route
    if (add.rules[ii].source === source) {
      exists = true
    } // if
  } // for

  if (! exists) {
    add.rules.push({
      'source' : source,
      'hosts' : []
    });

    for (ii = 0; ii < add.rules.length; ii++) {

    // push all the hosts into the rule
      if (add.rules[ii].source === source) {
        hosts.forEach(function(host) {

          add.rules[ii].hosts.push(host);
        });
      } // if
    } // for
    
    callback();  
  } else {
    for (ii = 0; ii < add.rules.length; ii++) {

      if (add.rules[ii].source === source) {
        hosts.forEach(function(host) {
        // check for the existance of an existing rule in the array
          if (!include(add.rules[ii].hosts, host)) {
            add.rules[ii].hosts.push(host);
          } // if 
        });  
      } // if
    } // for
    callback();
  } // if...else
} // add

// remove the route form the rules object
Nginx.prototype.del = function(hosts, source, callback) {
  var del = this
    , exists = false;
  
  for (var ii = 0; ii < del.rules.length; ii++) {
  // flag if there is already an entry fro the new route
    if (del.rules[ii].source === source) {
      exists = true
    } // if
  } // for

  if (! exists) {
    callback(new Error('No such route')); 
  } else {
    for (ii = 0; ii < del.rules.length; ii++) {

      if (del.rules[ii].source === source) {
        hosts.forEach(function(host) {
        // check for the existance of an existing rule in the array
          if (include(del.rules[ii].hosts, host)) {
            del.rules[ii].hosts.splice(del.rules[ii].hosts.indexOf(host), 1);
          } // if 
        });
        
        if (del.rules[ii].hosts.length == 0) {
          del.rules.splice(ii, 1);
        } // if  
      } // if
    } // for

    callback(null);
  } // if...else
} // del

// update the config on disk but don't restart it yet
Nginx.prototype.update = function(callback) {
  var source = fs.readFileSync(path.resolve(__dirname, '../', 'templates', 'nginx.tpl'), 'utf8')
    , template = handlebars.compile(source)
    , routes = {
      'route' : this.rules
    };

  var file = template(routes);

  fs.writeFile(path.join(this.dir, 'conf', 'nginx.conf'), file, function(err) {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  })
} // update

Nginx.prototype.reload = function(callback) {
  var pid = fs.readFileSync(path.join(this.dir, 'logs', 'nginx.pid'));

  if (!pid) {
    callback(new Error('Nginx not running or pid file not found'));
  } else {
    // send the HUP signal to the nginx master process, telling it to reload it config
    exec('kill -HUP ' + pid, function(err, stdout, stderr) {
      if (err) {
        callback(err);
      } else {
        callback(null);
      } // if...else
    });
  } // if...else
} // reload