'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reducer;

var _objectPathImmutable = require('object-path-immutable');

var _objectPathImmutable2 = _interopRequireDefault(_objectPathImmutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {};

function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  if (action.type === 'requests/invalidate') {
    return _objectPathImmutable2.default.del(state, action.payload.name);
  }

  if (!action.meta || !action.meta.api) {
    return state;
  }

  var _action$meta = action.meta,
      metaType = _action$meta.type,
      name = _action$meta.name,
      params = _action$meta.params;


  if (metaType === 'request') {
    return _objectPathImmutable2.default.set(state, [name, JSON.stringify(params)], {
      isLoading: true,
      data: null,
      error: null
    });
  } else if (metaType === 'response' && action.payload) {
    var newState = state;
    var data = action.payload.data;


    var normalizedData = Array.isArray(data) ? data.map(function (record) {
      return { id: record.id, type: record.type };
    }) : { id: data.id, type: data.type };

    newState = _objectPathImmutable2.default.set(newState, [name, JSON.stringify(params), 'response'], normalizedData);

    // newState = immutable.set(
    //   newState,
    //   [action.type, JSON.stringify(params), 'totalCount'],
    //   parseInt(headers['x-total'], 10),
    // );

    newState = _objectPathImmutable2.default.set(newState, [name, JSON.stringify(params), 'isLoading'], false);

    return newState;
  } else if (metaType === 'error') {
    var _newState = state;

    _newState = _objectPathImmutable2.default.set(_newState, [name, JSON.stringify(params), 'isLoading'], false);

    _newState = _objectPathImmutable2.default.set(_newState, [name, JSON.stringify(params), 'error'], action.payload);

    return _newState;
  }

  return state;
}