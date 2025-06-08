
exports.up = function (knex) {
    return knex.schema.createTable('comments', function (table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('video_id').unsigned().references('id').inTable('videos').onDelete('CASCADE');
        table.text('comment').default('').notNullable();
        table.timestamp('upload_date').defaultTo(knex.fn.now());

        table.unique(['user_id', 'video_id']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('comments');
};