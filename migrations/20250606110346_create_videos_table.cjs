
exports.up = function (knex) {
    return knex.schema.createTable('videos', function (table) {
        table.increments('id').primary();
        table.string('title', 50).notNullable();
        table.text('description');
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.string('thumbnail_url');
        table.string('video_url');
        table.timestamp('upload_date').defaultTo(knex.fn.now());
        table.integer('views').defaultTo(0);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('videos');
};