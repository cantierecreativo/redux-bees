"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEntity = getEntity;
exports.getRequestResult = getRequestResult;
exports.isRequestLoading = isRequestLoading;
exports.hasRequestStarted = hasRequestStarted;
exports.getRawRequestError = getRawRequestError;
exports.getRequestInfo = getRequestInfo;
function getRawRequest(state, apiCall, args) {
  var actionName = apiCall.actionName;


  if (!state.bees.requests) {
    return null;
  }

  if (!state.bees.requests[actionName]) {
    return null;
  }

  return state.bees.requests[actionName][JSON.stringify(args)];
}

function getEntity(state, handle) {
  if (!state.bees.entities) {
    return null;
  }

  if (!state.bees.entities[handle.type]) {
    return null;
  }

  return state.bees.entities[handle.type][handle.id];
}

function getRequestResult(state, apiCall, args) {
  var request = getRawRequest(state, apiCall, args);

  if (!request || request.isLoading || request.error) {
    return null;
  }

  if (Array.isArray(request.response)) {
    return request.response.map(function (handle) {
      return getEntity(state, handle);
    });
  }

  return getEntity(state, request.response);
}

function isRequestLoading(state, apiCall, args) {
  var request = getRawRequest(state, apiCall, args);
  return request && request.isLoading ? true : false;
}

function hasRequestStarted(state, apiCall, args) {
  var request = getRawRequest(state, apiCall, args);
  return !!request;
}

function getRawRequestError(state, apiCall, args) {
  var request = getRawRequest(state, apiCall, args);

  if (!request) {
    return false;
  }

  return request.error;
}

function getRequestInfo(state, apiCall, args) {
  var error = getRawRequestError(state, apiCall, args);

  return {
    hasStarted: hasRequestStarted(state, apiCall, args),
    isLoading: isRequestLoading(state, apiCall, args),
    hasFailed: !!error,
    result: getRequestResult(state, apiCall, args),
    error: error
  };
}