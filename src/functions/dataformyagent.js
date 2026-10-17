const { GetOptions } = require('../config/helper');

async function getAgentData() {
  const agentDataResponse = await fetch('https://api.spacetraders.io/v2/my/agent', GetOptions());
  const shipResponse = await fetch('https://api.spacetraders.io/v2/my/ships', GetOptions());
  const agentDataResult = await agentDataResponse.json();
  const shipResult = await shipResponse.json();

  if (!shipResponse.ok || shipResult.error) {
    throw new Error(shipResult.error?.message || `Ship request failed with status ${shipResponse.status}`);
  }
  if (!agentDataResponse.ok || agentDataResult.error) {
    throw new Error(agentDataResult.error?.message || `Agent request failed with status ${agentDataResponse.status}`);
  }

  console.dir({ agent: agentDataResult.data, ships: shipResult.data }, { depth: null, colors: true });
  return { agent: agentDataResult.data, ships: shipResult.data };
}

module.exports = { getAgentData };

if (require.main === module) {
  getAgentData()
    .then(data => console.log(data))
    .catch(err => console.error(err));
}