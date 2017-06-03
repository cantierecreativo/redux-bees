import {
  get,
  post,
  patch,
  put,
  destroy,
} from './httpMethods';

import {
  getEntity,
  getRequestResult,
  isRequestLoading,
  hasRequestStarted,
  getRequestError,
  getRequestInfo,
} from './selectors';

import {
  invalidateRequests,
} from './actions';

export { default as buildApi } from './buildApi';
export { default as reducer } from './reducer';
export { default as middleware } from './middleware';
export { default as query } from './query';

export {
  get,
  post,
  patch,
  put,
  destroy,

  getEntity,
  getRequestResult,
  isRequestLoading,
  hasRequestStarted,
  getRequestError,
  getRequestInfo,

  invalidateRequests,
};

