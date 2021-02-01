const puppeteer = require("puppeteer");
const connection = require("../database/connection.js");
const { findlasturl } = require("./lasturl.js");
const lastURL = require("./lasturl.js");

const scrape = async (pageId) => {
  const browser = await puppeteer.launch({
    // headless: false
  });

  const page = await browser.newPage();

  await page.goto(
    `http://www.al.ba.gov.br/transparencia/prestacao-contas/${pageId}`
  );

  await page.waitFor("tbody > tr > td", {
    timeout: 3000,
  });

  const result = await page.evaluate(() => {
    let data = {};
    let save = [];
    let report = [];

    let history = document.querySelectorAll("tbody > tr");
    let deputy = document.querySelector(".titulo-presidente > span");
    let numberProcess = document.querySelector(".titulo-bloco-lista > span");

    history.forEach((item) => {
      return item.childElementCount === 5 ? save.push(item) : false;
    });

    save.forEach((item) => {
      data = {
        category: item.children[0].innerText,
        numberNf: item.children[1].innerText,
        cpf_cnpj: item.children[2].innerText,
        company: item.children[3].innerText,
        money: item.children[4].innerText,
        deputy: deputy.innerText,
        monthYear: numberProcess.innerText.split(" - ")[1],
        numberProcess: numberProcess.innerText.split(" - ")[0],
      };
      report.push(data);
    });
    return report;
  });

  browser.close();
  return result;
};

module.exports = {
  async loop() {
    // const lastSavedUrl = await connection("lasturl").select("*");
    // console.log(lasturl);
    // console.log(lastSavedUrl[0].number);

    // if (Number(lastSavedUrl[0].number) < Number(lasturl)) {
    //   console.log("sim");
    //   await connection("lasturl")
    //     .where("number", lastSavedUrl[0].number)
    //     .update({
    //       lasturl,
    //     });
    // } else {
    //   console.log("senão");
    // }
    console.log(await lastURL());
    

    // let loop = setInterval(() => {
    //   if (URLNumber != lastURL) {
    //     scrape(numberURLs).then((value) => {
    //       value.forEach(async (item) => {
    //         let {
    //           category,
    //           numberNf,
    //           cpf_cnpj,
    //           company,
    //           money,
    //           deputy,
    //           monthYear,
    //           numberProcess,
    //         } = item;

    //         await connection("data")
    //           .insert({
    //             category,
    //             numberNf,
    //             cpf_cnpj,
    //             company,
    //             money,
    //             deputy,
    //             monthYear,
    //             numberProcess,
    //           })
    //           .then()
    //           .catch(() => {
    //             console.log(error);
    //           });
    //       });
    //     });
    //   } else {
    //     console.log(
    //       "BANANA BANANA BANANA BANANA BANANA BANANA BANANA BANANA CARLOS É VIADO"
    //     );
    //     stopTimer();
    //   }
    //   numberURLs++;
    // }, 10000);

    function stopTimer() {
      clearInterval(loop);
    }
  },
};

return 0;

// if (Number(lastSavedUrl[0].number) < Number(lasturl) ) {
//   console.log('sim')
//   await connection("lasturl").where('number', lastSavedUrl[0].number).update({
//     lasturl,
//   })
// } else {
//   console.log('senão')
// };
