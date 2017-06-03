'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = query;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _selectors = require('./selectors');

var _object = require('object.omit');

var _object2 = _interopRequireDefault(_object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultDispatcher = function defaultDispatcher(call) {
  return call();
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function query(propName, apiCall) {
  var dispatcher = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultDispatcher;

  return function (InnerComponent) {
    var Wrapper = function (_React$Component) {
      _inherits(Wrapper, _React$Component);

      function Wrapper(props) {
        _classCallCheck(this, Wrapper);

        var _this = _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).call(this, props));

        _this.fetch = _this.fetch.bind(_this);
        return _this;
      }

      _createClass(Wrapper, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.fetch();
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          if (!nextProps.request.isLoading && !nextProps.request.hasStarted) {
            this.fetch(nextProps);
          }
        }
      }, {
        key: 'fetch',
        value: function fetch() {
          var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
          var dispatch = props.dispatch;


          return dispatch(dispatcher(apiCall, props));
        }
      }, {
        key: 'render',
        value: function render() {
          var _extends3;

          var props = _extends({}, (0, _object2.default)(this.props, ['request']), (_extends3 = {}, _defineProperty(_extends3, propName, this.props.request.result), _defineProperty(_extends3, 'status', _extends({}, this.props.status, _defineProperty({}, propName, _extends({}, (0, _object2.default)(this.props.request, ['result']), {
            fetch: this.fetch
          })))), _extends3));

          return _react2.default.createElement(InnerComponent, props);
        }
      }]);

      return Wrapper;
    }(_react2.default.Component);

    Wrapper.displayName = 'Query(' + propName + ', ' + getDisplayName(InnerComponent) + ')';

    var mapStateToProps = function mapStateToProps(state, props) {
      var argumentsAbsorber = function argumentsAbsorber() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return args;
      };

      return {
        request: (0, _selectors.getRequestInfo)(state, apiCall, dispatcher(argumentsAbsorber, props))
      };
    };

    return (0, _reactRedux.connect)(mapStateToProps)(Wrapper);
  };
}