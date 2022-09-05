const gamesPlayedCountUrl =  'https://www.coolbet.com/s/casino-statistics/fo/game-played-count';
// const gamesPlayedCountUrl =  'http://localhost:8081/game-played-count.json';

const playUrlPrefix = 'https://www.coolbet.com/en/game/';

/**
 * @type {UrlContentConfig}
 */
const defaultUrlContentConfig = {
  country: 'EE',
  currency: 'EUR',
  device: 'mobile',
  language: 'en'
}

/**
 *
 * @param {UrlContentConfig} [param]
 * @return {string}
 */
const generateContentUrl = (param) => {
  /** @type {UrlContentConfig} */
  const normalisedParam = { ... defaultUrlContentConfig, ... param };
  const contentJSONUrl =  new URL('https://www.coolbet.com/s/casino/fo/games/');
  // const contentJSONUrl =  new URL('http://localhost:8081/games.json');
  contentJSONUrl.searchParams.append('country', normalisedParam.country);
  contentJSONUrl.searchParams.append('currency', normalisedParam.currency);
  contentJSONUrl.searchParams.append('device', normalisedParam.device);
  contentJSONUrl.searchParams.append('language', normalisedParam.language);
  contentJSONUrl.searchParams.append('licence', 'EE');
  contentJSONUrl.searchParams.append('userCountry', 'EE');

  return contentJSONUrl.toString();
}

module.exports = {
  generateContentUrl,
  gamesPlayedCountUrl,
  playUrlPrefix
}
