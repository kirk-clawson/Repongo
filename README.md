# Repongo
A repository pattern implementation for MongoDB based on MongoJS. This project offers 4 primary features:
- Repository pattern with simple data objects
- Optional schema definition and validation in and out of the repository.
- A query builder system to easily create custom queries
- A fluent API to define fields on the schema

More information, examples, and API documentation can be found on the [Wiki site](https://github.com/kirk-clawson/Repongo/wiki).

Installation:
```
npm install repongo
```

[MongoDB connection string documentation](http://docs.mongodb.org/manual/reference/connection-string/)

### Basic repository usage:
```JavaScript
// connecting to a server
// connection string format is documented at mongodb.org (link above)
var repongo = require('repongo');
var db = new repongo.Connection('mongodb://localhost/my_database');

// get an instance of an untyped repository for the catalog "cats"
// this repository won't validate your objects against a schema
var repo = db.createRepository('cats');

// Insert data (or update if the object passed in already has an _id property)
repo.save({name: 'Mr. Puggles', age: 6})
    .then(function (result) {
        console.log(result); // 'result' is the saved object with the Mongo PK stored in _id
    })
    .catch(function (err) {
        console.log('There was an error: ' + err);
    });
```

### Schema example:
```JavaScript
var repongo = require('repongo');
var db = new repongo.Connection('mongodb://localhost/my_database');

// create the schema
var catSchema = repongo.schemaFactory.create('cats');
// create a model object that defines the fields
var catModel = {
    name: repongo.fieldFactory.string().isRequired(),
    age: repongo.fieldFactory.int()
};
// add the model to the schema
catSchema.addModel(catModel);
// you can also add fields in an ad-hoc manner:
catSchema.addField('ownerName', repongo.fieldFactory.string());

var repo = db.createRepository(catSchema);

var badCat = { age: 'xyz' };
repo.save(badCat); // fails with 2 validation errors

```