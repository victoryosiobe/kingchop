const readline = require('readline')
const Kingchop = require('./index.js');


//For user input though cmd line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false //to stop duplication of input
});

function userInput(userInput) {
  const perfReport = true
  const init_perf = performance.now()
  // Process the input
  const response = new Kingchop({}).toSentence(userInput)
  const tPef = performance.now() - init_perf
  // Use the processed input as desired
  perfReport ? console.log('\n\n', 'Output: ', response, '\n', 'Performance: ', tPef) : console.log('\n\n', 'Output: ', response)

  // Ask another input from cmd line.
  askCmdLineInput();
}

function askCmdLineInput() {
    rl.question('Input: ', userInput)
}

askCmdLineInput()
