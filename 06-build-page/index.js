const {
  copyFile,
  mkdir,
  readdir,
  rm,
  readFile,
  writeFile,
} = require('node:fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const { join } = require('node:path');

const projectDist = 'project-dist';

async function copyFiles(src, dest) {
  const files = await readdir(src, { withFileTypes: true });

  files.forEach(async (file) => {
    if (file.isDirectory()) {
      const newDest = join(__dirname, projectDist, 'assets', file.name);
      await mkdir(newDest);
      copyFiles(join(file.path, file.name), newDest);
    } else {
      copyFile(`${src}/${file.name}`, `${dest}/${file.name}`);
    }
  });
}

async function copyAssetsDirectory() {
  const src = `${__dirname}/assets`;
  const dest = `${__dirname}/${projectDist}/assets`;

  await rm(dest, { force: true, recursive: true });
  await mkdir(dest, { recursive: true });
  await copyFiles(src, dest);
}

async function mergeStyles() {
  const folderPath = `${__dirname}/styles`;
  const files = await readdir(folderPath, { withFileTypes: true });
  const writeStream = createWriteStream(
    join(__dirname, 'project-dist', 'style.css'),
  );

  files.forEach((file) => {
    if (!file.isFile() || !file.name.endsWith('.css')) return;

    const stream = createReadStream(join(file.path, file.name));

    stream.on('data', (data) => {
      writeStream.write(data.toString() + '\n');
    });
  });
}

async function bundleHtml() {
  const template = await readFile(join(__dirname, 'template.html'));
  const templateString = template.toString();
  const pattern = /{{\w+}}/g;
  const matches = templateString.matchAll(pattern);
  const tags = Array.from(matches).map(([tag]) => tag);

  let finalTemplate = templateString;

  for (const tag of tags) {
    try {
      const component = await readFile(
        join(__dirname, 'components', `${tag.replace(/{|{|}|}/g, '')}.html`),
        'utf-8',
      );
      const componentString = component.toString();
      finalTemplate = finalTemplate.replaceAll(tag, componentString);
    } catch {
      throw new Error(
        'Error during build, check that all files in `components` folder is a `html` files',
      );
    }
  }

  await writeFile(join(__dirname, projectDist, 'index.html'), finalTemplate);
}

async function main() {
  const dest = `${__dirname}/${projectDist}`;

  await rm(dest, { force: true, recursive: true });
  await mkdir(dest, { recursive: true });
  await Promise.all([mergeStyles(), copyAssetsDirectory(), bundleHtml()]);

  console.log(
    'Project successfully bundled you can find it in `project-dist` folder',
  );
}

main();
