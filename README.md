# Repongo
A Javascript-based Repository pattern implementation for MongoDB.

Installation:
```
npm install repongo
```

Example usage without schema:
```JavaScript
var db = require('repongo')('mongo connection string');

var repo = db.createRepo('cats');
var pugglesId;

repo.save({name: 'Mr. Puggles', age: 6})
    .then(function (result) {
        console.log(result); // returns object after saving, including an _id property with the Mongo PK
        pugglesId = result._id;
    });
    
repo.get(pugglesId)
    .then (function(result) {
        console.log('Result is Mr. Puggles again?');
        console.log(result);
    });
    
repo.getAll()
    .then(function(result) {
        console.log('Mr. Puggles is lonely');
        console.log(result.length); // 1
    });
    
repo.delete(pugglesId)
    .then(function(result) {
        console.log('Bye, bye, Mr. Puggles. :(');
    });
```