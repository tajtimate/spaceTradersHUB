const { GetOptions } = require('../config/helper');
const { getAgentData } = require('./dataformyagent');

async function getAgentHeadquarters() {
  const agent = await getAgentData();
  const headquarters = agent.headquarters;
  const separator = headquarters.lastIndexOf('-');

  if (separator < 1 || separator === headquarters.length - 1) {
    throw new Error(`Invalid headquarters waypoint symbol: ${headquarters}`);
  }

  const systemSymbol = headquarters.slice(0, separator);
  const waypointSymbol = headquarters;
  const url = `https://api.spacetraders.io/v2/systems/${systemSymbol}/waypoints/${waypointSymbol}`;
  const response = await fetch(url, GetOptions());
  const result = await response.json();

  if (!response.ok || result.error) {
    throw new Error(result.error?.message || `Waypoint request failed with status ${response.status}`);
  }

  return result.data;
}

getAgentHeadquarters()
  .then(data => console.log(data))
  .catch(err => console.error(err));