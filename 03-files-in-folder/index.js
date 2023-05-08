const fs = require('fs');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach(file => {
    if (file.isFile()) {
      const fileName = path.parse(file.name).name;
      const fileExtension = path.parse(file.name).ext.replace('.', '');
      const fileStats = fs.statSync(path.join(secretFolderPath, file.name));
      const fileSizeInBytes = fileStats.size;
      const fileSizeInKilobytes = fileSizeInBytes / 1000;
      console.log(`${fileName}-${fileExtension}-${fileSizeInKilobytes.toFixed(3)}kb`);
    }
  });
});
