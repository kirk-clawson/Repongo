# Repongo
A repository pattern implementation for MongoDB based on MongoJS. This project offers 3 primary features:
- Repository pattern with simple data objects
- Optional schema definition and validation in and out of the repository.
- A query builder system to easily create custom queries

Installation:
```
npm install repongo
```

[MongoDB connection string documentation](http://docs.mongodb.org/manual/reference/connection-string/)

Examples:
```JavaScript
// connecting to a server
// the connection string format is documented at the above link
var db = require('repongo')('mongodb://localhost/my_database');

// get an instance of an untyped repository for the catalog "cats"
// this repository won't check your object formats to ensure they conform to a specific schema
var repo = db.createRepo('cats');

// Insert data (or update if the object passed in already has an _id property)
var pugglesId;
repo.save({name: 'Mr. Puggles', age: 6})
    .then(function (result) {
        console.log(result); // returns object after saving, including an _id property with the Mongo PK
        pugglesId = result._id;
    })
    .catch(function (err) {
        console.log('There was an error: ' + err);
    });
    
// Get a single entity from the catalog
repo.get(pugglesId)
    .then (function(result) {
        console.log('Result is Mr. Puggles again?');
        console.log(result);
    });
    
// Get all entities from the catalog
repo.getAll()
    .then(function(result) {
        console.log('Mr. Puggles is lonely');
        console.log(result.length); // 1
    });

// delete an entity from the catalog
repo.delete(pugglesId)
    .then(function(result) {
        console.log('Bye, bye, Mr. Puggles. :(');
    });
```