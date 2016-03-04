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

Examples for simple repository actions:
```JavaScript
// connecting to a server
var repongo = require('repongo');

// the connection string format is documented at the mongodb.org link above
var db = new repongo.Connection('mongodb://localhost/my_database');

// get an instance of an untyped repository for the catalog "cats"
// if the repository exists, this opens it; if not, this will create, then open it
// this repository won't validate your objects against a schema
var repo = db.createRepository('cats');

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

Examples of setting up a Schema:
```JavaScript
var repongo = require('repongo');
var db = new repongo.Connection('mongodb://localhost/my_database');

var catFields = [
    { fieldName: 'name', isRequired: true },                        // name is required
    { fieldName: 'age', typeValidator: repongo.validators.int() }   // age is an integer
];

var schemaOptions = {
    catalogName: 'cats',
    fields: catFields
};

var catSchema = db.schemaFactory(schemaOptions);
var repo = db.createRepository(catSchema);

var badCat = { age: 'xyz' };
repo.save(badCat)
    .catch(function (err) {
        console.log(err.message);
        console.log(err.data); // returns your object as-is with one additional property called _validationResult  
                               // it will contain the validation errors for the missing name field and the invalid
                               // age data type
    });
```