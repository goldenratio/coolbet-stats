const fetch = require("node-fetch");

const {generateContentUrl, gamesPlayedCountUrl, playUrlPrefix} = require("./url-config");

function fetchStats() {
  return new Promise((resolve, reject) => {
    let content;
    getContentData()
      .then(data => {
        content = data;
        return getActiveUsers();
      })
      .then(activeUsersData => {
        content.forEach(data => {
          if (activeUsersData[data.id]) {
            data.activeUsers = activeUsersData[data.id];
          }
        })
        resolve(content);
      })
      .catch(err => reject(err));
  });
}

function getContentData() {
  return new Promise((resolve, reject) => {
    const contentUrl = generateContentUrl();
    fetch(contentUrl)
      .then(response => {
        if (!response.ok) {
          reject('error: cannot reach url ', contentUrl, ', status code: ', response.status);
          return;
        }
        response.json()
          .then(parsedData => {
            const formattedData = parsedData.map(data => {
              let gameNameUrlSuffix = replaceAll(data.name.toLowerCase(), ' ', '-');
              gameNameUrlSuffix = replaceAll(gameNameUrlSuffix, '\'', '');
              return  {
                id: data.id,
                gameName: data.name,
                playUrl: playUrlPrefix +  gameNameUrlSuffix + '-' + data.id,
                activeUsers: 0
              }
            });
            resolve(formattedData);
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
}

function getActiveUsers() {
  return new Promise((resolve, reject) => {
    fetch(gamesPlayedCountUrl)
      .then(res => {
        if (!res.ok) {
          reject('error: cannot reach url ', gamesPlayedCountUrl, ', status code: ', res.status);
          return;
        }
        res.json()
          .then(parsedData => {
            const formattedData = {};
            parsedData.forEach(data => {
              formattedData[data.gameId] = data.playCount;
            });
            resolve(formattedData);
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
}

/**
 * @param {string} value
 * @param {string} search
 * @param {string} replacement
 * @return {string}
 */
function replaceAll(value, search, replacement) {
  const parts = value.split(search);
  return parts.join(replacement);
}

module.exports = {
  fetchStats
};
