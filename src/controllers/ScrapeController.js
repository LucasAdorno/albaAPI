const connection = require('../database/connection');

module.exports = {
  async create(request, response) {

    const requests = await connection('data')
      .select('*')

    let deputys = [];
    let politicalParties = [];
    let categories = [];
    let totalDeputys = [];
    let totalParties = [];
    let totalCategories = [];


    requests.map(item => {
      deputys.push(item.deputy)
      politicalParties.push(item.deputy.split('(')[1].replace(')', ''))
      categories.push(item.category.split(';')[0])
    }
    )

    deputys = deputys.filter((item, index, self) => index === self.indexOf(item))
    politicalParties = politicalParties.filter((item, index, self) => index === self.indexOf(item))
    categories = categories.filter((item, index, self) => index === self.indexOf(item))


    deputys.map(deputy => {
      let values = [];
      let deputyCategory = [];
      let finalValue = 0;

      requests.map(item => {
        if (item.deputy === deputy) {
          values.push(item.money)
          deputyCategory.push(item.category)
        }
      })

      values.map(value => {

        value = value.replace('R$ ', '')
        value = value.replace('.', '')
        value = value.replace(',', '.')

        finalValue += Number(value)

      })

      let formatedFinalValue = finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

      totalDeputys.push({ name: deputy, values, finalValue, formatedFinalValue, deputyCategory })

      totalDeputys = totalDeputys.sort((a, b) => b.finalValue - a.finalValue);


    })

    politicalParties.map(politicalParty => {
      let values = [];
      let finalValue = 0;

      requests.map(item => {
        item.deputy.split('(')[1].replace(')', '') === politicalParty ? values.push(item.money) : ''
      })

      values.map(value => {

        value = value.replace('R$ ', '')
        value = value.replace('.', '')
        value = value.replace(',', '.')

        finalValue += Number(value)
      })
      let formatedFinalValue = finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      totalParties.push({ name: politicalParty, finalValue, formatedFinalValue })

      totalParties = totalParties.sort((a, b) => b.finalValue - a.finalValue);

    })

    categories.map(category => {
      let values = [];
      let finalValue = 0;

      requests.map(item => {
        item.category === category ? values.push(item.money) : ''
      })

      values.map(value => {

        value = value.replace('R$ ', '')
        value = value.replace('.', '')
        value = value.replace(',', '.')

        finalValue += Number(value)

      })

      let formatedFinalValue = finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

      totalCategories.push({ name: category, finalValue, formatedFinalValue })

      totalCategories = totalCategories.sort((a, b) => b.finalValue - a.finalValue);


    })

    let topFiveDeputys = totalDeputys.slice(0, 5);
    let topFiveParties = totalParties.slice(0, 5);
    let topFiveCategories = totalCategories.slice(0, 5);


    const data = {
      totalDeputys,
      totalParties,
      totalCategories,
      topFiveDeputys,
      topFiveParties,
      topFiveCategories
    }

    return response.json(data);
  }
}