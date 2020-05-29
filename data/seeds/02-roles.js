exports.seed = function(knex, Promise) {
  // Inserts seed entries
  return knex('roles').insert([
    {name: 'admin', description: 'Administrator role - has access to everything'},
    {name: 'manager', description: 'Managers who can manage customer accounts but not internal security'},
    {name: 'customer', description: 'All customers with a valid account'},
    {name: 'guest', description: 'Users who have not created a full account yet'}
  ]);
};
