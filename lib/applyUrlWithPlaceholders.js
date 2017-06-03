'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applyUrlWithPlaceholders;

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function applyUrlWithPlaceholders(url, placeholders) {
  var query = {};

  var completeUrl = Object.keys(placeholders).reduce(function (acc, key) {
    var token = ':' + key;

    if (acc.indexOf(token) !== -1) {
      return acc.replace(token, placeholders[key]);
    }

    if (placeholders[key]) {
      query[key] = placeholders[key];
    }

    return acc;
  }, url);

  if (Object.keys(query).length > 0) {
    return completeUrl + '?' + _queryString2.default.stringify(query);
  }

  return completeUrl;
}