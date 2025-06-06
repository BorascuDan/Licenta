
exports.up = function (knex) {
    return knex.schema.createTable('likes', function (table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().unique().references('id').inTable('users').onDelete('CASCADE');
        table.integer('video_id').unsigned().unique().references('id').inTable('videos').onDelete('CASCADE');
        table.tinyint('like_status')
        table.timestamp('upload_date').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('likes');
};