import { buildApi, get, post, patch, destroy } from 'redux-bees';

const apiEndpoints = {
  getSite:           { method: get, path: '/site' },
  getModelRecords:   { method: get, path: '/items', required: ['filter[type]'] },
};

const config = {
  baseUrl: 'https://site-api.datocms.com',
  configureHeaders(headers) {
    return {
      ...headers,
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzaXRlX2lkIjo3MiwiYWNjb3VudCI6dHJ1ZX0.d4sBKdrTOWt8sMPCVCMCaBD5C4Ibx4aaQDUDWIeoZio',
      'X-Site-Domain': 'empty-wind-6725.admin.datocms.com'
    };
  },
};

export default buildApi(apiEndpoints, config);
