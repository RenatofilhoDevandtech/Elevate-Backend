// src/utils/pdfGenerator.js
const puppeteer = require('puppeteer');
const fs = require('fs/promises'); // Usamos fs.promises para async/await
const path = require('path');

// Função auxiliar para ler e converter imagem para base64 (se você usar imagens no template)
async function imageToBase64(imagePath) {
    try {
        const imageBuffer = await fs.readFile(imagePath);
        return imageBuffer.toString('base64');
    } catch (error) {
        console.error(`Erro ao ler imagem ${imagePath}:`, error);
        return ''; // Retorna vazio em caso de erro
    }
}

async function generateCertificatePDF(data) {
    // Caminho para o template HTML do certificado
    const templatePath = path.join(__dirname, '../templates/certificateTemplate.html');
    let html = await fs.readFile(templatePath, 'utf-8');

    // Substituir os placeholders pelos dados reais
    html = html.replace('{{USER_NAME}}', data.userName);
    html = html.replace('{{PATH_TITLE}}', data.pathTitle);
    html = html.replace('{{ISSUED_DATE}}', data.issuedDate);
    html = html.replace('{{UNIQUE_CODE}}', data.uniqueCode);
    // Adicionar substituições para imagens se você as embutir como Base64 no template
    // Ex: html = html.replace('{{ELEVATE_LOGO_BASE64}}', data.elevateLogoBase64);
    // Ex: html = html.replace('{{SIGNATURE_IMAGE_BASE64}}', data.signatureImageBase64);
    // Ex: html = html.replace('{{VERIFY_URL}}', `https://elevate.com/verify/${data.uniqueCode}`); // Exemplo de URL de verificação

    // Iniciar o Puppeteer
    const browser = await puppeteer.launch({ 
        headless: true, // true para execução em servidor sem interface gráfica
        // As 'args' abaixo são importantes para rodar em ambientes de deploy (Linux/Docker como Render)
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();

    // Carregar o HTML e gerar o PDF
    await page.setContent(html, { waitUntil: 'networkidle0' }); // Espera a rede ficar inativa para carregar fontes/estilos
    const pdfBuffer = await page.pdf({
        format: 'A4',
        landscape: true, // Modo paisagem
        printBackground: true, // Inclui cores de fundo e bordas
        margin: { // Margens para o PDF final
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px'
        }
    });

    // Fechar o navegador e retornar o PDF como um buffer
    await browser.close();
    return pdfBuffer;
}

module.exports = { generateCertificatePDF };

/*
// Exemplo de uso da função imageToBase64 no certificateController.js (se for usar)
// src/controllers/certificateController.js
const { generateCertificatePDF, imageToBase64 } = require('../utils/pdfGenerator');
// ...
exports.downloadCertificate = async (req, res) => {
    // ...
    // Carregue os base64 das imagens uma vez (pode ser no início do arquivo ou cache)
    const elevateLogoBase64 = await imageToBase64(path.resolve(__dirname, '../assets/elevate_logo.png'));
    const directorSignatureBase64 = await imageToBase64(path.resolve(__dirname, '../assets/director_signature.png'));
    
    const pdfData = {
        // ... seus dados existentes
        elevateLogoBase64, // Adicione ao objeto de dados
        signatureImageBase64: directorSignatureBase64, // Adicione ao objeto de dados
        uniqueCode: certData.unique_code,
        VERIFY_URL: `https://elevate.com/verify/${certData.unique_code}` // Exemplo de URL de verificação
    };
    const pdfBuffer = await generateCertificatePDF(pdfData);
    // ...
};
*/