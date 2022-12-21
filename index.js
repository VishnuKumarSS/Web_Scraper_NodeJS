require("dotenv").config();
const puppeteer = require("puppeteer");
const fileSystem = require("fs/promises");

const urlLink = process.env.URL_LINK;
// urlLink = document.getElementById('urlId').innerHTML

async function startFun() {
  const browserVar = await puppeteer.launch(); // NOTE: we can only use await inside a async function.
  const browserPage = await browserVar.newPage();
  await browserPage.goto(urlLink);

  const paragraph = await browserPage.evaluate(() => {
    // document.querySelectorAll('h1') // it will return the node list of elements...kindof array
    // for that we are using array from method
    return Array.from(document.querySelectorAll("p")).map((a) => a.textContent);
  });

  await fileSystem.writeFile(
    "ScrapedFiles/Paragraphs/paragraph.txt",
    paragraph.join("\r\n\n")
  );

  const heading1 = await browserPage.evaluate(() => {
    return Array.from(document.querySelectorAll("h1")).map(
      (a) => a.textContent
    );
  });
  await fileSystem.writeFile(
    "ScrapedFiles/Headings/heading1.txt",
    heading1.join("\r\n\n")
  );

  const heading2 = await browserPage.$$eval("h2", (h2s) => {
    return h2s.map((b) => b.textContent);
  });
  await fileSystem.writeFile(
    "ScrapedFiles/Headings/heading2.txt",
    heading2.join("\r\n\n")
  );

  const heading3 = await browserPage.$$eval("h3", (h3s) => {
    return h3s.map((b) => b.textContent);
  });
  await fileSystem.writeFile(
    "ScrapedFiles/Headings/heading3.txt",
    heading3.join("\r\n\n")
  );

  const heading4 = await browserPage.$$eval("h4", (h4s) => {
    return h4s.map((b) => b.textContent);
  });
  await fileSystem.writeFile(
    "ScrapedFiles/Headings/heading4.txt",
    heading4.join("\r\n\n")
  );

  const heading5 = await browserPage.$$eval("h5", (h5s) => {
    return h5s.map((b) => b.textContent);
  });
  await fileSystem.writeFile(
    "ScrapedFiles/Headings/heading5.txt",
    heading5.join("\r\n\n")
  );

  const heading6 = await browserPage.$$eval("h6", (h6s) => {
    return h6s.map((b) => b.textContent);
  });
  await fileSystem.writeFile(
    "ScrapedFiles/Headings/heading6.txt",
    heading6.join("\r\n\n")
  );

  // another method ( that puppeteer give us to simply return as Original array.)
  const pictures = await browserPage.$$eval("img", (imgs) => {
    return imgs.map((b) => b.src);
  });

  for (const pic of pictures) {
    const imagePage = await browserPage.goto(pic); // it will navigate to the url of the pic
    await fileSystem.writeFile(
      `ScrapedFiles/Pictures/${pic.split("/").pop()}`,
      await imagePage.buffer()
    );
  }

  await browserVar.close();
}

try {
  startFun();
  console.log("Scraped Headings, Paragraphs and Pictures");
} catch {
  console.log("Try again, not scraped :)");
}
