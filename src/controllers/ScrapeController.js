const connection = require('../database/connection');

module.exports = {
  async create(request, response) {

    const requests = await connection('data')
      .select('*')

    let deputys = [];
    let politicalParties = [];
    let totalDeputys = [];
    let totalParties = []


    requests.map(item => {
        deputys.push(item.deputy)
        politicalParties.push(item.deputy.split('(')[1].replace(')', ''))
      }
    )

    deputys = deputys.filter((item, index, self) => index === self.indexOf(item))
    politicalParties = politicalParties.filter((item, index, self) => index === self.indexOf(item))


    deputys.map(deputy => {
      let values = [];
      let finalValue = 0;

      requests.map(item => {
        item.deputy === deputy ? values.push(item.money) : ''
      })

      values.map(value => {

        value = value.replace('R$ ', '')
        value = value.replace('.', '')
        value = value.replace(',', '.')

        finalValue += Number(value)

      })

      let formatedFinalValue = finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'}) 

      totalDeputys.push({ deputy, values, finalValue, formatedFinalValue })
      
    })

    politicalParties.map( politicalParty => {
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
      let formatedFinalValue = finalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});


      totalParties.push({ politicalParty, finalValue, formatedFinalValue })
      
    })

    return response.json({totalDeputys, totalParties});
  }
}