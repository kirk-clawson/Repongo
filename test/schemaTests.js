/**
 * Created by Kirk.Clawson on 2/24/2016.
 */
var repongo = require('../index.js');
var should = require('should');

describe('With an empty Repository,', function () {
    var db = new repongo.Connection('mongodb://localhost/my_database');

    describe('And a defined schema', function(){
        var catFields = [
            {fieldName: 'name', isRequired: true},
            {fieldName: 'age', typeValidator: repongo.validators.int()}
        ];
        var schemaOptions = {
            catalogName: 'cats',
            fields: catFields
        };

        var catSchema = repongo.schemaFactory(schemaOptions);
        var repoUnderTest = db.createRepository(catSchema);

        beforeEach(function () {
            repoUnderTest.clear();
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
                        err.data._validationResult.isValid.should.equal(false);
                        done();
                    });
            });
        });
    });
});