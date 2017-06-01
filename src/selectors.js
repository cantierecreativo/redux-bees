function getRawRequest(state, apiCall, args) {
  const { actionName } = apiCall;

  if (!state.bees.requests) {
    return null;
  }

  if (!state.bees.requests[actionName]) {
    return null;
  }

  return state.bees.requests[actionName][JSON.stringify(args)];
}

export function getEntity(state, handle) {
  if (!state.bees.entities) {
    return null;
  }

  if (!state.bees.entities[handle.type]) {
    return null;
  }

  return state.bees.entities[handle.type][handle.id];
}

export function getRequestResult(state, apiCall, args) {
  const request = getRawRequest(state, apiCall, args);

  if (!request || request.isLoading || request.error) {
    return null;
  }

  if (Array.isArray(request.response)) {
    return request.response.map(handle => getEntity(state, handle));
  }

  return getEntity(state, request.response);
}

export function isRequestLoading(state, apiCall, args) {
  const request = getRawRequest(state, apiCall, args);
  return request && request.isLoading;
}

export function hasRequestStarted(state, apiCall, args) {
  const request = getRawRequest(state, apiCall, args);
  return !!request;
}

export function getRawRequestError(state, apiCall, args) {
  const request = getRawRequest(state, apiCall, args);

  if (!request) {
    return false;
  }

  return request.error;
}

export function getRequestInfo(state, apiCall, args) {
  const error = getRawRequestError(state, apiCall, args);

  return {
    hasStarted: hasRequestStarted(state, apiCall, args),
    isLoading: isRequestLoading(state, apiCall, args),
    hasFailed: !!error,
    result: getRequestResult(state, apiCall, args),
    error,
  };
}
