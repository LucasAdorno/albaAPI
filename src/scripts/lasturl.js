const puppeteer = require("puppeteer");
const connection = require("../database/connection.js");

  async function findlasturl() {
    const browser = await puppeteer.launch({
      headless: false
    });

    const page = await browser.newPage();

    await page.goto(
      `http://www.al.ba.gov.br/transparencia/prestacao-contas/`
    );

    await page.waitFor("tbody > tr > td", {
      timeout: 3000,
    });

    await page.click('.table-itens > td > a');

    let lasturl = page.url();

    lasturl = lasturl.split('/')[5];

    const lastSavedUrl = await connection('lasturl').select('*');
    console.log(lasturl);
    console.log(lastSavedUrl[0].number);

    if (Number(lastSavedUrl[0].number) < Number(lasturl) ) {
      console.log('sim')
      await connection("lasturl").where('number', lastSavedUrl[0].number).update({
        lasturl,
      })
    } else {
      console.log('senão')
    };

    
  }
  findlasturl();



