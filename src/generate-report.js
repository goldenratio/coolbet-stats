const fs = require('fs-extra')
const replace = require('replace-in-file');

const outDir = 'dist';

function generateReport(contentList) {
  fs.emptydirSync(outDir);
  const destFile = `${outDir}/index.html`;
  fs.copySync('html-template/index.html', destFile);

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
}

module.exports = {
  generateReport
}
