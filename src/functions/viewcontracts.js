const readline = require('readline/promises');
const { stdin, stdout } = require('process');
const { GetOptions } = require('../config/helper');

async function acceptContract(contractId) {
  const response = await fetch(
    `https://api.spacetraders.io/v2/my/contracts/${contractId}/accept`, GetOptions()
  );
  const result = await response.json();

  if (!response.ok || result.error) {
    console.log('response details:', response);
    throw new Error(result.error?.message || `Contract acceptance failed with status ${response.status}`);
  }

  return result.data;
}

async function viewContractsAndPrompt() {
  const response = await fetch('https://api.spacetraders.io/v2/my/contracts', GetOptions());
  const result = await response.json();

  if (!response.ok || result.error) {
    throw new Error(result.error?.message || `Contract request failed with status ${response.status}`);
  }

  console.dir(result, { depth: null, colors: true });
  const firstContract = result.data?.[0];

  if (!firstContract) {
    console.log('No contracts available to accept.');
    return;
  }

  const terminal = readline.createInterface({ input: stdin, output: stdout });

  try {
    let answer;
    do {
      answer = (await terminal.question(
        `Accept the first contract (${firstContract.id})? [Y/N] `
      )).trim().toLowerCase();
    } while (answer !== 'y' && answer !== 'n');

    if (answer === 'y') {
      const acceptedContract = await acceptContract(firstContract.id);
      console.dir(acceptedContract, { depth: null, colors: true });
    } else {
      console.log('Contract not accepted.');
    }
  } finally {
    terminal.close();
  }
}

viewContractsAndPrompt().catch(err => console.error(err));