import {
  get,
  post,
  patch,
  destroy,
} from './src/httpMethods';

import {
  getEntity,
  getRequestResult,
  isRequestLoading,
  hasRequestStarted,
  getRequestError,
  getRequestInfo,
} from './src/selectors';

import {
  clearRequests,
} from './src/actions';

export { default as buildApi } from './src/buildApi';
export { default as reducer } from './src/reducer';
export { default as middleware } from './src/middleware';
export { default as query } from './src/query';

export {
  get,
  post,
  patch,
  destroy,

  getEntity,
  getRequestResult,
  isRequestLoading,
  hasRequestStarted,
  getRequestError,
  getRequestInfo,

  clearRequests,
};

