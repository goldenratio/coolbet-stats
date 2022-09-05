const {fetchStats} = require("./fetch-stats");
const {generateReport} = require("./generate-report");

fetchStats()
  .then(data => {
    // sort data in descending order based on activeUsers
    const dataCopy = Object.create(data);
    dataCopy.sort((a, b) => (a.activeUsers < b.activeUsers) ? 1 : -1)
    return generateReport(dataCopy);
  })
  .catch(err => {
    console.error(err);
    console.log('\n\n FAILED!');
  });
