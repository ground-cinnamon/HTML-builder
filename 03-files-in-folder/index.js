const { readdir, readFile } = require('node:fs/promises');
const { parse } = require('node:path');

function formatToKb(bytes) {
  return (bytes / 1024).toFixed(3) + 'kb';
}

const folderPath = `${__dirname}/secret-folder`;

async function main() {
  const files = await readdir(folderPath, { withFileTypes: true });

  files.forEach(async (file) => {
    if (!file.isFile()) return;

    const { name, ext } = parse(file.name);
    const { byteLength: size } = await readFile(`${file.path}/${file.name}`);

    console.log(`${name} - ${ext.replace('.', '')} - ${formatToKb(size)}`);
  });
}

main();
