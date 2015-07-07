var _ = require('lodash');

/**
 * Add events to the model definition
 * to bind events to all instances of that model
 *
 * @param bookshelf
 */
module.exports = function(bookshelf) {
    var proto = bookshelf.Model.prototype;
    var extend = bookshelf.Model.extend;
    var events = {};

    var on = function(event, callback) {
        // what do we use as a key...?
        var key = this;
        if (!events[key]) {
            events[key] = [];
        }

        events[key].push([event, callback]);
    };

    bookshelf.Model.extend = function() {
        var child = extend.apply(this, arguments);
        child.on = on;

        return child;
    };

    bookshelf.Model.on = on;

    // Bind all the events global model to an instance on instantiation
    bookshelf.Model = bookshelf.Model.extend({
        constructor: function (attributes, options) {
            proto.constructor.apply(this, arguments);
        },

        initialize: function() {
            _.each(events[this.__proto__.constructor], function(toAdd) {
                this.on(toAdd[0], toAdd[1]);
            }, this);
        }
    });

};
