const puppeteer = require('puppeteer');
const connection = require('../database/connection.js');

const scrape = async () => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage()

  await page.goto(`http://www.al.ba.gov.br/transparencia/prestacao-contas`);

  await page.waitFor('tbody > tr > td', {
    timeout: 3000
  });
  

  const result = await page.evaluate(() => {
    let data = {};
    let save = [];
    let report = [];

    let history = document.querySelectorAll('tbody > tr')

    history.forEach(item => {
      return item.childElementCount === 6 ? save.push(item) : false;
    })

    save.forEach(item => {
      data = {
        numberProcesse: item.children[0].innerText,
        numberNf: item.children[1].innerText,
        monthYear: item.children[2].innerText,
        deputy: item.children[3].innerText,
        category: item.children[4].innerText,
        money: item.children[5].innerText,
      }
      report.push(data)
    })
    return report
  })
  
  await page.click('tbody > tr > td > a > button');

  await page.waitFor('tbody > tr > td', {
    timeout: 3000
  });

  browser.close()
  return result
};

scrape().then(value => {
  value.forEach(async item => {
    let { numberProcesse, numberNf, monthYear, deputy, category, money } = item;

    await connection('data')
      .insert({
        numberProcesse,
        numberNf,
        monthYear,
        deputy,
        category,
        money
      })
  })
  console.log(value);
})
