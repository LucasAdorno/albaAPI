exports.up = function(knex) {
  return knex.schema.createTable('data', function (table) {
    table.string('numberProcesse');
    table.string('numberNf').primary();
    table.string('monthYear');
    table.string('deputy');
    table.string('category');
    table.string('model');
    table.string('money');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('data')
};