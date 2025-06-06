
exports.up = function (knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments('id').primary();
        table.string('username', 50).notNullable();
        table.string('email', 100).notNullable().unique();
        table.string('password', 100).notNullable();
        table.string('profile_pic_url');
        table.string('backround_pic_url');
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');
};