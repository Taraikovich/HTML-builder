const fs = require('fs');
const path = require('path');

const styles = path.join(__dirname, 'styles');
const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

const output = fs.createWriteStream(bundleFile);

fs.readdir(styles, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const readFile = path.join(styles, file.name);
      const input = fs.createReadStream(readFile, 'utf-8');
      input.pipe(output);
    }
  });
});
