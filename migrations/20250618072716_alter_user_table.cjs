exports.up = function (knex) {
    return knex.schema.alterTable('users', function (table) {
      table.json('recommended_videos').nullable();
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.alterTable('users', function (table) {
      table.dropColumn('recommended_videos');
    });
  };
  