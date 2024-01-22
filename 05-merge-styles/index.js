const { readdir } = require('node:fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const { join } = require('node:path');

const folderPath = `${__dirname}/styles`;

async function main() {
  const files = await readdir(folderPath, { withFileTypes: true });
  const writeStream = createWriteStream(
    join(__dirname, 'project-dist', 'bundle.css'),
  );

  files.forEach((file) => {
    if (!file.isFile() || !file.name.endsWith('.css')) return;

    const stream = createReadStream(join(file.path, file.name));

    stream.on('data', (data) => {
      writeStream.write(data.toString() + '\n');
    });
  });
}

main();
