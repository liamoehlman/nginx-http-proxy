## Premise
This library allows for the generation of a nginx config file from a set of templates. For each endpoint e.g /test there can be many servers attached to it. There can also be many endpoints defined.  

Nginx should be build from source for use with this library as the "-p" flag does not seem to work in the nginx ubuntu package.

## Usage
``` 
var proxy = require('nginx-proxy'),
    nginx = new proxy('/path/to/nginx/dir');
``` 

## Methods
Will forward requests for localhost/test to localhost:8000/test
```
nginx.add(['localhost:8000'], 'test', function(err) {
  console.log(err);
});
```  
Will forward request for localhost/test to localhost:8000/test and localhost:8001 via round-robin
```
nginx.add(['localhost:8000', 'localhost:8001'], 'test'), function(err) {
  console.log(err);
});  
---------------------------------------- 

This will remove localhost:8000 from the /test endpoint
```
nginx.del(['localhost:8000'], 'test'), function(err) {
  console.log(err);
});
```

----------------------------------------  

After using nginx.add() or nginx.del() changes will be written to disk via rules.json

----------------------------------------
Generates the nginx config from the rules
```
nginx.update(function(err) {
  console.log(err);
});
```  
Reloads nginx's config and thus applys all rules written from nginx.update()
```
nginx.reload(function(err) {
  console.log(err);
});
```
