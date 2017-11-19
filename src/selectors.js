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
  if (!handle) {
    return null;
  }

  if (!state.bees.entities) {
    return null;
  }

  if (!state.bees.entities[handle.type]) {
    return null;
  }

  return state.bees.entities[handle.type][handle.id];
}

export function getRelationship(state, entity, relationshipName) {
  if (!entity) {
    return null;
  }

  const relationship = entity.relationships[relationshipName];
  if (!relationship) {
    return null;
  }

  const { data } = relationship;

  if (Array.isArray(data)) {
    return data.map(handle => getEntity(state, handle));
  }

  return getEntity(state, data);
}

export function getRequestResult(state, apiCall, args) {
  const request = getRawRequest(state, apiCall, args);

  if (!request || !request.response) {
    return null;
  }

  if (Array.isArray(request.response)) {
    return request.response.map(handle => getEntity(state, handle));
  }

  return getEntity(state, request.response);
}

export function getRequestHeaders(state, apiCall, args) {
  const request = getRawRequest(state, apiCall, args);
  return request && request.headers;
}

export function getRequestMeta(state, apiCall, args) {
  const request = getRawRequest(state, apiCall, args);
  return request && request.meta;
}

export function isRequestLoading(state, apiCall, args) {
  const request = getRawRequest(state, apiCall, args);
  return request && request.isLoading ? true : false;
}

export function hasRequestStarted(state, apiCall, args) {
  const request = getRawRequest(state, apiCall, args);

  if (!request) {
    return false;
  }

  if (request.invalid) {
    return false;
  }

  return true;
}

export function getRequestError(state, apiCall, args) {
  const request = getRawRequest(state, apiCall, args);

  if (!request) {
    return false;
  }

  return request.error;
}

export function getRequestInfo(state, apiCall, args) {
  const error = getRequestError(state, apiCall, args);

  return {
    hasStarted: hasRequestStarted(state, apiCall, args),
    isLoading: isRequestLoading(state, apiCall, args),
    hasFailed: !!error,
    result: getRequestResult(state, apiCall, args),
    headers: getRequestHeaders(state, apiCall, args),
    meta: getRequestMeta(state, apiCall, args),
    error,
  };
}
