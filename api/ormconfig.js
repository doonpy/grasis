const dev = require('./src/orm-configs/dev').default;
const product = require('./src/orm-configs/prod').default;
const local = require('./src/orm-configs/local').default;

const DatabaseType = {
  STAGING: 'staging',
  PRODUCTION: 'production'
};

let configs;
function getConfigs() {
  switch (process.env.DB_TYPE) {
    case DatabaseType.STAGING:
      configs = dev;
      break;
    case DatabaseType.PRODUCTION:
      configs = product;
      break;
    default:
      configs = local;
      break;
  }

  return configs;
}

module.exports = getConfigs();
