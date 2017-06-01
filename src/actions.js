export function invalidateRequests(apiCall) {
  return {
    type: 'requests/invalidate',
    payload: { name: apiCall.actionName }
  };
}
