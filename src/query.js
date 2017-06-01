import React from 'react';
import { connect } from 'react-redux';
import { getRequestInfo } from './selectors';
import omit from 'object.omit';

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
          this.fetch();
        }
      }

      fetch() {
        const { dispatch } = this.props;

        return dispatch(dispatcher(apiCall, this.props));
      }

      render() {
        const props = {
          ...omit(this.props, ['request']),
          [propName]: this.props.request.result,
          status: {
            ...this.props.status,
            [propName]: {
              ...omit(this.props.request, ['result']),
              fetch: this.fetch,
            },
          },
        };

        return <InnerComponent {...props} />;
      }
    }

    Wrapper.displayName = `Query(${propName}, ${getDisplayName(InnerComponent)})`;

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
