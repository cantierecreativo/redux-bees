'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = buildApi;

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _applyUrlWithPlaceholders = require('./applyUrlWithPlaceholders');

var _applyUrlWithPlaceholders2 = _interopRequireDefault(_applyUrlWithPlaceholders);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfigure = function defaultConfigure(options) {
  return options;
};

function buildApi(endpoints) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var baseUrl = config.baseUrl,
      _config$configureOpti = config.configureOptions,
      configureOptions = _config$configureOpti === undefined ? defaultConfigure : _config$configureOpti,
      _config$configureHead = config.configureHeaders,
      configureHeaders = _config$configureHead === undefined ? defaultConfigure : _config$configureHead;


  return Object.keys(endpoints).reduce(function (acc, key) {
    var _endpoints$key = endpoints[key],
        path = _endpoints$key.path,
        required = _endpoints$key.required,
        normalizeArguments = _endpoints$key.method;


    var requiredPlaceholders = required || [];
    var placeholderRegexp = /:([^\/$]+)/g;
    var match = void 0;

    while (match = placeholderRegexp.exec(path)) {
      requiredPlaceholders.push(match[1]);
    }

    acc[key] = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var normalizedArguments = normalizeArguments.apply(undefined, args);

      var placeholders = normalizedArguments.placeholders || {};
      var options = normalizedArguments.options || {};

      var augmentedOptions = _extends({}, options, {
        headers: configureHeaders(_extends({}, options.headers, {
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json'
        }))
      });

      var callable = requiredPlaceholders.every(function (key) {
        return placeholders[key];
      });

      if (!callable) {
        return { type: '@BEESNOOP' };
      }

      var req = (0, _request2.default)(baseUrl, (0, _applyUrlWithPlaceholders2.default)(path, placeholders), configureOptions(augmentedOptions));

      req.actionName = key;
      req.params = args;

      return req;
    };

    acc[key].actionName = key;

    return acc;
  }, {});
};