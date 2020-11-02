const DatabaseType = {
  STAGING: 'staging',
  PRODUCTION: 'production'
};

let configs;
function getConfigs() {
  switch (process.env.DB_TYPE) {
    case DatabaseType.STAGING:
      configs = require('./orm-configs/staging.json');
      break;
    case DatabaseType.PRODUCTION:
      configs = require('./orm-configs/prod.json');
      break;
    default:
      configs = require('./orm-configs/local.json');
      break;
  }

  return configs;
}

module.exports = getConfigs();
