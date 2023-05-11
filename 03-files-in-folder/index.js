const fs = require('fs');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(secretFolderPath, file.name);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        };
        const fileName = path.parse(file.name).name;
        const fileExtension = path.parse(file.name).ext.replace('.', '');
        const fileSizeInBytes = stats.size;
        const fileSizeInKilobytes = fileSizeInBytes / 1000;
        console.log(
          `${fileName}-${fileExtension}-${fileSizeInKilobytes.toFixed(3)}kb`
        );
      });
    };
  });
});
