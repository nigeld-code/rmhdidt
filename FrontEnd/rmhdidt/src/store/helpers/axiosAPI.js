const axios = require('axios');

/**
 * Make axios request to graphql API
 * @param {Object} graphqlQuery
 */
const axiosAPI = (graphqlQuery, customHeaders) => {
  return axios({
    method: 'POST',
    url: 'http://localhost:3000/graphql',
    headers: { ...customHeaders, 'Content-Type': 'application/json' },
    data: JSON.stringify(graphqlQuery)
  });
};

exports.axiosAPI = axiosAPI;
