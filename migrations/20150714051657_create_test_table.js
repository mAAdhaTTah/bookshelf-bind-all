exports.up = function (knex) {
    return knex.schema.createTable('test', function (t) {
        t.increments('id').primary();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('test');
};