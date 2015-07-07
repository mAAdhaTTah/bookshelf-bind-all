// set up our test runners
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);
var expect = chai.expect;

// set up bookshelf and its SQLite connection
var knex = require('knex')(require('../knexfile').development);
var bookshelf = require('bookshelf')(knex);

// add the plugin under test
var bind_all = require('../index');
bookshelf.plugin(bind_all);

// use this test model throughout
var TestModel = bookshelf.Model.extend({
    tableName: 'test'
});

describe('bookshelf-bind-all', function() {
    before(function () {
        return knex.migrate.latest();
    });

    it('should add a global `on` method', function() {
        expect(TestModel).to.respondTo('on');
    });

    it('should add all the event listeners to a new instance', function() {
        // bind our global event listener
        var spy = chai.spy(function() {
            return true;
        });
        TestModel.on('fetching', spy);

        // fire away!
        var test = new TestModel();
        test.fetch()
            .then(function() {
                expect(spy).to.have.been.called();
            });
    });

    after(function () {
        return knex.migrate.rollback();
    });
});