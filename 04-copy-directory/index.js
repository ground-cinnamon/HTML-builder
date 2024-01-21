const { copyFile, mkdir, readdir, rm } = require('node:fs/promises');

async function main() {
  const src = `${__dirname}/files`;
  const dest = `${__dirname}/files-copy`;

  await rm(dest, { force: true, recursive: true });
  await mkdir(dest, { recursive: true });

  const files = await readdir(src);

  files.forEach((file) => {
    copyFile(`${src}/${file}`, `${dest}/${file}`);
  });
}

main();
