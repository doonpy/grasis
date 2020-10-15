const dev = require('./src/orm-configs/dev.json');
const product = require('./src/orm-configs/prod.json');
const local = require('./src/orm-configs/local.json');

const DatabaseType = {
  STAGING: 'staging',
  PRODUCTION: 'production'
};

let envFile;
function getConfigsFile() {
  switch (process.env.DB_TYPE) {
    case DatabaseType.STAGING:
      envFile = dev;
      break;
    case DatabaseType.PRODUCTION:
      envFile = product;
      break;
    default:
      envFile = local;
      break;
  }

  return envFile;
}

module.exports = getConfigsFile();
