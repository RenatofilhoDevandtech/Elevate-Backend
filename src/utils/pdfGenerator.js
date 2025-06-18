// src/utils/pdfGenerator.js
const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const path = require('path');

async function generateCertificatePDF(data) {
  // Ler o template HTML do arquivo
  const templatePath = path.join(__dirname, '../templates/certificateTemplate.html');
  let html = await fs.readFile(templatePath, 'utf-8');

  // Substituir os placeholders pelos dados reais
  html = html.replace('{{USER_NAME}}', data.userName);
  html = html.replace('{{PATH_TITLE}}', data.pathTitle);
  html = html.replace('{{ISSUED_DATE}}', data.issuedDate);
  html = html.replace('{{UNIQUE_CODE}}', data.uniqueCode);

  // Iniciar o Puppeteer
  const browser = await puppeteer.launch({ 
    headless: true,
    // As 'args' abaixo são importantes para rodar em ambientes de deploy (Linux/Docker)
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();

  // Carregar o HTML e gerar o PDF
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({
    format: 'A4',
    landscape: true,
    printBackground: true,
  });

  // Fechar o navegador e retornar o PDF como um buffer
  await browser.close();
  return pdfBuffer;
}

module.exports = { generateCertificatePDF };