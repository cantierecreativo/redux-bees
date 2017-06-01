export function clearRequests(apiCall) {
  return {
    type: 'requests/clear',
    payload: { name: apiCall.actionName }
  };
}
