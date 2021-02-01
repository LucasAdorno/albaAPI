const puppeteer = require("puppeteer");

async function findlasturl() {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();

  await page.goto(`http://www.al.ba.gov.br/transparencia/prestacao-contas/`);

  await page.waitFor("tbody > tr > td", {
    timeout: 3000,
  });

  await page.click(".table-itens > td > a");

  let lasturl = page.url();

  lasturl = lasturl.split("/")[5];

  return lasturl;
}

export default findlasturl;
