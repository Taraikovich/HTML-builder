const fs = require('fs');
const { stdin, stdout } = process;
const path = require('path');

const text = path.join(__dirname, 'text.txt');
console.log('Введите текст:');
const output = fs.createWriteStream(text);
stdin.on('data', (chunk) => {
  if (chunk.toString().trim() === 'exit') {
    stdout.write('Програма завершилась');
    process.exit();
  }
  output.write(chunk);
});
stdin.on('error', (error) => console.log('Error', error.message));
process.on('SIGINT', () => {
  stdout.write('Программа завершилась');
  process.exit();
});
