const rimraf = require('rimraf');

const pruneList = [
  'src',
  'types',
  'tsconfig*',
  'nest-cli.json',
  '.eslintrc.js',
  'orm-configs',
  'ormconfig.js'
];

if (process.env.NODE_ENV === 'production') {
  pruneList.forEach((item) =>
    rimraf(item, () => {
      console.log(`Remove: ${item}`);
    })
  );
}
