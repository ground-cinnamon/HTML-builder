const { createReadStream } = require('fs');

const stream = createReadStream(__dirname + '/text.txt');

stream.on('data', (data) => {
  console.log(data.toString());
});
