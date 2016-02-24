/**
 * Created by Kirk.Clawson on 2/24/2016.
 */
var repongo = require('../main.js');
var should = require('should');

describe('With an empty Repository,', function () {
    var db = repongo('mongodb://localhost/my_database');

    describe('And a defined schema', function(){
        var catFields = {
            name: {isRequired: true},
            age: {type: db.types.int}
        };
        var schemaOpts = {
            catalog: 'cats',
            fields: catFields,
            keepExtraFields: true
        };

        var catSchema = db.createSchema(schemaOpts);
        var repoUnderTest = db.createRepo(catSchema);

        beforeEach(function () {
            repoUnderTest._clear();
        });

        describe('when an invalid cat is inserted', function () {
            it('causes an error', function (done) {
                var badCat = {age: 'xyz'};
                repoUnderTest.save(badCat)
                    .catch(function (err) {
                        should.exist(err);
                        err.message.should.not.equal('');
                        should.exist(err.data);
                        should.exist(err.data._validationResult);
                        err.data._validationResult._isValid.should.equal(false);
                        done();
                    });
            });
        });
    });
});