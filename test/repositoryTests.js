/**
 * Created by Kirk.Clawson on 2/21/2016.
 */
var repongo = require('../index.js');
var should = require('should');

describe('With an empty Repository,', function () {

    var db = new repongo.Connection('mongodb://localhost/repongo_test');
    var repoUnderTest = db.createRepository('cat');

    describe('when a cat is inserted', function () {
        it('Inserts one record that can be read back', function (done) {
            var id;
            repoUnderTest.save({name: 'Mr. Puggles', age: 6})
                .then(function (result) {
                    should.exist(result);
                    result.should.have.property('_id');
                    id = result._id;
                    return repoUnderTest.getAll();
                })
                .then(function (result) {
                    should.exist(result);
                    result.length.should.equal(1);
                    id.should.equal(result[0]._id);
                    done();
                })
                .catch(function (err) {
                    should.not.exist(err);
                    done();
                });
        });
    });

    afterEach(function () {
        repoUnderTest.clear();
    });
});