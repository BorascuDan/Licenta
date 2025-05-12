/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {id: 1, username: 'user1', email: 'user1@email.ro', password: 'abcd123'},
    {id: 2, username: 'user2', email: 'user2@email.ro', password: 'abcd123'},
    {id: 3, username: 'user3', email: 'user3email.ro', password: 'abcd123'},
  ]);
};
