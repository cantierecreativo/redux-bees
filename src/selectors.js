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

  const separatorIndex = relationshipName.indexOf('.');
  if (separatorIndex !== -1) {
    const head = relationshipName.substring(0, separatorIndex);
    const tail = relationshipName.substring(separatorIndex + 1);
    const newEntity = getRelationship(state, entity, head);

    if (Array.isArray(newEntity)) {
      return Array.prototype.concat.apply([], newEntity.map(handle => getRelationship(state, handle, tail)));
    } else {
      return getRelationship(state, newEntity, tail);
    }
  }

  const { data } = entity.relationships[relationshipName];

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
