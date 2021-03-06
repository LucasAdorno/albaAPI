const connection = require("../database/connection");

module.exports = {
  async create(request, response) {
    const requests = await connection("data").select("*");

    let deputies = [];
    let politicalParties = [];
    let categories = [];
    let totalDeputies = [];
    let totalParties = [];
    let totalCategories = [];

    requests.map((item) => {
      deputies.push(item.deputy);
      politicalParties.push(item.deputy.split("(")[1].replace(")", ""));
      categories.push(item.category.split(";")[0]);
    });

    deputies = deputies.filter(
      (item, index, self) => index === self.indexOf(item)
    );
    politicalParties = politicalParties.filter(
      (item, index, self) => index === self.indexOf(item)
    );
    categories = categories.filter(
      (item, index, self) => index === self.indexOf(item)
    );

    deputies.map((deputy) => {
      let values = [];
      let deputyCategory = [];
      let finalValue = 0;

      requests.map((item) => {
        if (item.deputy === deputy) {
          values.push(item.money);
          deputyCategory.push(item.category);
        }
      });

      values.map((value) => {
        value = value.replace("R$ ", "");
        value = value.replace(".", "");
        value = value.replace(",", ".");

        finalValue += Number(value);
      });

      let formatedFinalValue = finalValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      totalDeputies.push({
        name: deputy,
        values,
        finalValue,
        formatedFinalValue,
        deputyCategory,
      });

      totalDeputies = totalDeputies.sort((a, b) => b.finalValue - a.finalValue);
    });

    politicalParties.map((politicalParty) => {
      let values = [];
      let partDeputies = [];
      let finalValue = 0;
      let midValue = 0;

      requests.map((item) => {
        item.deputy.split("(")[1].replace(")", "") === politicalParty
          ? values.push(item.money)
          : "";
      });

      totalDeputies.map((item) => {
        item.name.split("(")[1].replace(")", "") === politicalParty
          ? partDeputies.push(item)
          : "";
      });

      values.map((value) => {
        value = value.replace("R$ ", "");
        value = value.replace(".", "");
        value = value.replace(",", ".");

        finalValue += Number(value);
      });
      midValue = finalValue / partDeputies.length;
      let formatedFinalValue = finalValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      let formatedMidValue = midValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      totalParties.push({
        name: politicalParty,
        finalValue,
        midValue,
        formatedFinalValue,
        formatedMidValue,
        partDeputies,
      });

      totalParties = totalParties.sort((a, b) => b.midValue - a.midValue);
    });

    categories.map((category) => {
      let values = [];
      let finalValue = 0;

      requests.map((item) => {
        item.category === category ? values.push(item.money) : "";
      });

      values.map((value) => {
        value = value.replace("R$ ", "");
        value = value.replace(".", "");
        value = value.replace(",", ".");

        finalValue += Number(value);
      });

      let formatedFinalValue = finalValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      totalCategories.push({ name: category, finalValue, formatedFinalValue });

      totalCategories = totalCategories.sort(
        (a, b) => b.finalValue - a.finalValue
      );
    });

    let topFiveDeputies = totalDeputies.slice(0, 5);
    let topFiveParties = totalParties.slice(0, 5);
    let topFiveCategories = totalCategories.slice(0, 5);

    const data = {
      totalDeputies,
      totalParties,
      totalCategories,
      topFiveDeputies,
      topFiveParties,
      topFiveCategories,
    };

    return response.json(data);
  },
};
