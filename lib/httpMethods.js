'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// placeholders
// placeholders, options

var get = exports.get = function get() {
  var placeholders = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return {
    placeholders: placeholders,
    options: options
  };
};

// placeholders, body, options
// body, options
// body

var post = exports.post = function post() {
  var _ref;

  var placeholders = arguments.length >= 3 ? arguments.length <= 0 ? undefined : arguments[0] : {};
  var body = arguments.length >= 3 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 0 ? undefined : arguments[0];
  var options = arguments.length >= 2 ? (_ref = arguments.length - 1, arguments.length <= _ref ? undefined : arguments[_ref]) : {};

  return {
    placeholders: placeholders,
    options: _extends({
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(body)
    }, options)
  };
};

// placeholders, body, options
// body, options
// body

var patch = exports.patch = function patch() {
  var _ref2;

  var placeholders = arguments.length >= 3 ? arguments.length <= 0 ? undefined : arguments[0] : {};
  var body = arguments.length >= 3 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 0 ? undefined : arguments[0];
  var options = arguments.length >= 2 ? (_ref2 = arguments.length - 1, arguments.length <= _ref2 ? undefined : arguments[_ref2]) : {};

  return {
    placeholders: placeholders,
    options: _extends({
      method: 'PATCH',
      mode: 'cors',
      body: JSON.stringify(body)
    }, options)
  };
};

// placeholders, body, options
// body, options
// body

var put = exports.put = function patch() {
  var _ref3;

  var placeholders = arguments.length >= 3 ? arguments.length <= 0 ? undefined : arguments[0] : {};
  var body = arguments.length >= 3 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 0 ? undefined : arguments[0];
  var options = arguments.length >= 2 ? (_ref3 = arguments.length - 1, arguments.length <= _ref3 ? undefined : arguments[_ref3]) : {};

  return {
    placeholders: placeholders,
    options: _extends({
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(body)
    }, options)
  };
};

// placeholders
// placeholders, options

var destroy = exports.destroy = function destroy() {
  var placeholders = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return {
    placeholders: placeholders,
    options: _extends({
      method: 'DELETE',
      mode: 'cors'
    }, options)
  };
};