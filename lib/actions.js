'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invalidateRequests = invalidateRequests;
function invalidateRequests(apiCall) {
  return {
    type: 'requests/invalidate',
    payload: { name: apiCall.actionName }
  };
}