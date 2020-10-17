const DatabaseType = {
  STAGING: 'staging',
  PRODUCTION: 'production'
};

let configs;
function getConfigs() {
  switch (process.env.DB_TYPE) {
    case DatabaseType.STAGING:
      configs = require('./dist/orm-configs/dev.json');
      break;
    case DatabaseType.PRODUCTION:
      configs = require('./dist/orm-configs/prod.json');
      break;
    default:
      configs = require('./src/orm-configs/local.json');
      break;
  }

  return configs;
}

module.exports = getConfigs();
