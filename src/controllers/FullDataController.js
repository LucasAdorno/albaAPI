const connection = require("../database/connection");

module.exports = {
  async create(request, response) {
    const requests = await connection("data").select("*");

    let parties = [];

    const data = [];

    requests.map(({ deputy }) => {
      parties.push(deputy.split("(")[1].replace(")", ""));
    });

    const tempParty = [];

    parties = parties.filter(
      (item, index, self) => self.indexOf(item) === index
    );

    parties.map((party, index) => {
      tempParty.push({ partido: party, deputados: [] });
      const tempDeputies = [];

      requests.map((item) => {
        if (item.deputy.split("(")[1].replace(")", "") === party) {
          if (tempDeputies.includes(item.deputy)) {
            tempParty[index].deputados[
              tempDeputies.indexOf(item.deputy)
            ].gastos.push({
              nota: item.numberNf,
              categoria: item.category,
              cpf_cnpj: item.cpf_cnpj,
              recebedor: item.company,
              date: item.monthYear,
              processo: item.numberProcess,
              valor: item.money,
            });
          } else {
            tempDeputies.push(item.deputy);
            tempParty[index].deputados.push({
              deputado: item.deputy,
              gastos: [
                {
                  nota: item.numberNf,
                  categoria: item.category,
                  cpf_cnpj: item.cpf_cnpj,
                  recebedor: item.company,
                  date: item.monthYear,
                  processo: item.numberProcess,
                  valor: item.money,
                },
              ],
            });
          }
        }
      });
    });

    return response.json(tempParty);
  },
};
