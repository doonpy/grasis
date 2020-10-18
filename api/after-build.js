const rimraf = require('rimraf');

const pruneList = ['src', 'tsconfig*', 'nest-cli.json', '.eslintrc.js'];

if (process.env.NODE_ENV === 'production') {
  pruneList.forEach((item) =>
    rimraf(item, () => {
      console.log(`Remove: ${item}`);
    })
  );
}
