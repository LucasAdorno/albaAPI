exports.up = function(knex) {
  return knex.schema.createTable('data', function (table) {
    table.string('category');
    table.string('numberNf').primary();
    table.string('cpf_cnpj');
    table.string('company');
    table.string('money');
    table.string('deputy');
    table.string('monthYear');
    table.string('numberProcess');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('data')
};