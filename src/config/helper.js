const { getAgentAuthorization } = require('../config/spaceCredentials');

const options = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': getAgentAuthorization(),
  },
};

module.exports = {
  GetOptions: function() {
    return options;
  }
};