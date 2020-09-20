const connection = require('../database/connection');

module.exports = {
  async create(request, response) {

    const requests = await connection('data')
      .select('*')

    return response.json(requests);
  }
}