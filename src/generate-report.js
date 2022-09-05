const path = require('path');
const fs = require('fs-extra')
const replace = require('replace-in-file');

const outDir = path.resolve('dist');

function generateReport(contentList) {
  const templateFile = path.resolve('html-template/index.html');
  const destFile = path.resolve(`${outDir}/index.html`);

  fs.emptydirSync(outDir);
  fs.copySync(templateFile, destFile);

  const buildDate = new Date().toUTCString();
  replace.sync({
    files: destFile,
    from: /{LAST_UPDATED}/g,
    to: buildDate
  })

  const htmlContent = contentList.map(data => {
    return `
    <tr>
      <td>${data.gameName}</td>
      <td>${data.activeUsers}</td>
      <td><a href="${data.playUrl}" target="_blank">${data.playUrl}</a></td>
    </tr>
    `;
  })
  replace.sync({
    files: destFile,
    from: /{CONTENT}/g,
    to: htmlContent.join('\n')
  })

  return destFile;
}

module.exports = {
  generateReport
}
