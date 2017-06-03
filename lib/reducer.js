'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reducer;

var _entities = require('./reducers/entities');

var _entities2 = _interopRequireDefault(_entities);

var _requests = require('./reducers/requests');

var _requests2 = _interopRequireDefault(_requests);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  return {
    requests: (0, _requests2.default)(state.requests, action),
    entities: (0, _entities2.default)(state.entities, action)
  };
};