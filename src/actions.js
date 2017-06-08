export function invalidateRequests(apiCall, params = null) {
  return {
    type: 'requests/invalidate',
    payload: {
      actionName: apiCall.actionName,
      params,
    }
  };
}
