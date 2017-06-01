import { buildApi, get, post, patch, destroy } from '../index';

const apiEndpoints = {
  getAccount:     { method: get,     path: '/account' },
  createAccount:  { method: post,    path: '/accounts' },
  updateAccount:  { method: patch,   path: '/account' },
  updatePassword: { method: patch,   path: '/account/update_password' },
  createSession:  { method: post,    path: '/sessions' },
  importSite:     { method: post,    path: '/sites/import' },
  createSite:     { method: post,    path: '/sites' },
  getSite:        { method: get,     path: '/sites/:id' },
  getSites:       { method: get,     path: '/sites' },
  destroySite:    { method: destroy, path: '/sites/:id' },
};

const config = {
  baseUrl: 'https://api.hardypress.com',
  configureHeaders(headers) {
    return {
      ...headers,
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50X2lkIjoxfQ.7B7xRhmpBS57hCIWBeaAvhpR2geALWdBckpuaMZa0rs',
    };
  },
};

export default buildApi(apiEndpoints, config);
