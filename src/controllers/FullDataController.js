const connection = require("../database/connection");

const totalFunction = (item) => {
  let money = item.money.replace("R$ ", "");
  money = money.replace(".", "");
  money = money.replace(",", ".");
  return Number(money);
};

module.exports = {
  async create(request, response) {
    const { query, startdate, enddate } = await request.body;
    console.log(query);

    let formulatedStartDate = new Date(startdate);
    formulatedStartDate =
      formulatedStartDate.getMonth() > 8
        ? formulatedStartDate.getFullYear() +
          "/" +
          formulatedStartDate.getMonth() +
          1
        : formulatedStartDate.getFullYear() +
          "/" +
          "0" +
          (formulatedStartDate.getMonth() + 1);

    let formulatedEndDate = new Date(enddate);
    formulatedEndDate =
      formulatedEndDate.getMonth() > 8
        ? formulatedEndDate.getFullYear() +
          "/" +
          formulatedEndDate.getMonth() +
          1
        : formulatedEndDate.getFullYear() +
          "/" +
          "0" +
          (formulatedEndDate.getMonth() + 1);

    console.log(formulatedEndDate);

    const requests = await connection("data")
      .select("*")
      .where("deputy", "like", `%${query}%`)
      .andWhere("monthYear", ">=", formulatedStartDate)
      .andWhere("monthYear", "<=", formulatedEndDate);

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
      tempParty.push({ partido: party, deputados: [], gasto_total_partido: 0 });
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
            tempParty[index].deputados[
              tempDeputies.indexOf(item.deputy)
            ].gasto_total += totalFunction(item);
            tempParty[index].gasto_total_partido += totalFunction(item);
          } else {
            tempDeputies.push(item.deputy);
            tempParty[index].deputados.push({
              deputado: item.deputy,
              gasto_total: totalFunction(item),
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
            tempParty[index].gasto_total_partido += totalFunction(item);
          }
        }
      });
    });
    console.log(tempParty);
    return response.json(tempParty);
  },
};
