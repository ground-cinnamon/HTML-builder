const { createInterface } = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { createWriteStream } = require('node:fs');

const lineInterface = createInterface({ input, output });
const stream = createWriteStream(__dirname + '/text.txt');

stream.on('ready', () => {
  console.log('Hi!!! Lets write some lines!');

  lineInterface.on('line', (line) => {
    if (!line.trim().length) return;

    if (line.toLowerCase() === 'exit') {
      sayGoodBye(lineInterface);
      return;
    }

    stream.write(line + '\n');
  });

  lineInterface.on('SIGINT', () => sayGoodBye(lineInterface));
});

function sayGoodBye(rl) {
  console.log('Bye bye little kozlik...');
  rl.close();
}
