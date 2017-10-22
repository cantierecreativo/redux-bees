import {
    get,
    post,
    patch,
    put,
    destroy,
  } from './httpMethods';

  import {
    getEntity,
    getRelationship,
    getRequestResult,
    isRequestLoading,
    hasRequestStarted,
    getRequestError,
    getRequestHeaders,
    getRequestMeta,
    getRequestInfo,
  } from './selectors';


  export { default as buildApi } from './buildApi';


  export {
    get,
    post,
    patch,
    put,
    destroy,

    getEntity,
    getRelationship,
    getRequestResult,
    isRequestLoading,
    hasRequestStarted,
    getRequestError,
    getRequestHeaders,
    getRequestMeta,
    getRequestInfo,
  };
  
  