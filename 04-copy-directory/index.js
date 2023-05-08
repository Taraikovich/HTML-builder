const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'files');
const folderCopy = path.join(__dirname, 'files-copy');

fs.access(folderCopy, (err) => {
  if (err) {
    fs.mkdir(path.join(__dirname, 'files-copy'), (err) => {
      if (err) throw err;
    });
  }
});

fs.readdir(folder, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const copyFile = path.join(folderCopy, file.name);
      const readFile = path.join(folder, file.name);
      const input = fs.createReadStream(readFile, 'utf-8');
      const output = fs.createWriteStream(copyFile);
      input.pipe(output);
    }
  });
});

