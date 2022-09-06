const fetch = require("node-fetch");

const {generateContentUrl, gamesPlayedCountUrl, playUrlPrefix} = require("./url-config");

const fetchOptions = {
  "credentials": "include",
  "headers": {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:104.0) Gecko/20100101 Firefox/104.0",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.7,et;q=0.3",
    "Content-Type": "application/json; charset=utf-8",
    "X-Device": "DESKTOP",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin"
  },
  "referrer": "https://www.coolbet.com/en/casino/slots",
  "method": "GET",
  "mode": "cors"
};

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
    fetch(contentUrl, fetchOptions)
      .then(response => {
        if (!response.ok) {
          reject(`error: cannot reach url: ${contentUrl}, status code: ${response.status}`);
          return;
        }
        response.json()
          .then(parsedData => {
            const formattedData = parsedData.map(data => {
              let gameNameUrlSuffix = replaceAll(data.name.toLowerCase(), ' ', '-');
              gameNameUrlSuffix = replaceAll(gameNameUrlSuffix, '\'', '');
              gameNameUrlSuffix = replaceAll(gameNameUrlSuffix, ':', '');
              gameNameUrlSuffix = replaceAll(gameNameUrlSuffix, '’', '');
              gameNameUrlSuffix = replaceAll(gameNameUrlSuffix, ',', '');
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
    fetch(gamesPlayedCountUrl, fetchOptions)
      .then(res => {
        if (!res.ok) {
          reject(`error: cannot reach url: ${gamesPlayedCountUrl}, status code: ${res.status}`);
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
