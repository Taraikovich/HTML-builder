const fs = require('fs');
const path = require('path');

const projectFolder = path.join(__dirname, 'project-dist');

fs.access(projectFolder, (err) => {
  if (err) {
    fs.mkdir(projectFolder, (err) => {
      if (err) throw err;
    });
  }
});

const componentsFolder = path.join(__dirname, 'components');
const htmlFile = path.join(projectFolder, 'index.html');
const templateFile = path.join(__dirname, 'template.html');

const inputTemplate = fs.createReadStream(templateFile, 'utf-8');

inputTemplate.on('error', (error) => {
  console.log(`Error reading file ${templateFile}: ${error.message}`);
});

let temp = '';

inputTemplate.on('data', (chunk) => {
  temp += chunk;
});

inputTemplate.on('end', () => {
  const tagMatches = temp.match(/\{\{(\w+)\}\}/g);
  let tagsObj = {};
  tagMatches.forEach((el) => {
    tagsObj[el] = `${el.slice(2, -2)}.html`;
  });

  const output = fs.createWriteStream(htmlFile);

  let filesRead = 0;
  for (let key in tagsObj) {
    let file = path.join(componentsFolder, tagsObj[key]);
    let input = fs.createReadStream(file, 'utf-8');
    let content = '';

    input.on('data', (chunk) => {
      content += chunk;
    });

    input.on('end', () => {
      filesRead++;
      temp = temp.replace(key, content);

      if (filesRead === Object.keys(tagsObj).length) {
        output.write(temp);
        output.end();
      }
    });

    input.on('error', (error) => {
      console.log(`Error reading file ${file}: ${error.message}`);
    });
  }
});

const styles = path.join(__dirname, 'styles');
const bundleFile = path.join(projectFolder, 'style.css');

fs.readdir(styles, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  const outputCSS = fs.createWriteStream(bundleFile);
  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const readFile = path.join(styles, file.name);
      const input = fs.createReadStream(readFile, 'utf-8');
      input.pipe(outputCSS);
    }
  });
});

async function copyDirectory(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });

  const files = await fs.promises.readdir(src);

  await Promise.all(
    files.map(async (file) => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);

      const stats = await fs.promises.stat(srcPath);
      if (stats.isDirectory()) {
        await copyDirectory(srcPath, destPath);
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    })
  );
}

const folder = path.join(__dirname, 'assets');
const folderCopy = path.join(projectFolder, 'assets');

copyDirectory(folder, folderCopy);
