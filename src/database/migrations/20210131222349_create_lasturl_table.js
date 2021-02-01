
exports.up = function(knex) {
  return knex.schema.createTable('lasturl', function (table) {
    table.string('number');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('lasturl')
};
