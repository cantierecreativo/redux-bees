import React from 'react';
import { connect } from 'react-redux';
import { getRequestInfo } from './selectors';
import { invalidateRequests } from './actions';
import omit from 'object.omit';
import hoistNonReactStatic from 'hoist-non-react-statics';

const defaultDispatcher = call => call();

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component';
}

export default function query(propName, apiCall, dispatcher = defaultDispatcher) {
  return (InnerComponent) => {
    class Wrapper extends React.Component {
      constructor(props) {
        super(props);
        this.fetch = this.fetch.bind(this);
      }

      componentDidMount() {
        this.fetch();
      }

      componentWillReceiveProps(nextProps) {
        if (!nextProps.request.isLoading && !nextProps.request.hasStarted) {
          this.fetch(nextProps);
        }
      }

      fetch(props = this.props) {
        const { dispatch } = props;
        return dispatch(dispatcher(apiCall, props));
      }

      render() {
        const props = {
          ...omit(this.props, ['request']),
          [propName]: this.props.request.result,
          status: {
            ...this.props.status,
            [propName]: {
              ...omit(this.props.request, ['result']),
              refetch: this.fetch,
            },
          },
        };

        return <InnerComponent {...props} />;
      }
    }

    Wrapper.displayName = `query(${getDisplayName(InnerComponent)}, ${propName})`;

    Wrapper.loadData = function(dispatch, props) {
      return dispatch(dispatcher(apiCall, props));
    };

    hoistNonReactStatic(Wrapper, InnerComponent);

    const mapStateToProps = (state, props) => {
      const argumentsAbsorber = (...args) => args;

      return {
        request: getRequestInfo(
          state,
          apiCall,
          dispatcher(argumentsAbsorber, props),
        ),
      };
    };

    return connect(mapStateToProps)(Wrapper);
  };
}
