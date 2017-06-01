import React from 'react';
import { connect } from 'react-redux';
import { getRequestInfo } from './selectors';

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

      fetch() {
        const { dispatch } = this.props;
        return dispatch(dispatcher(apiCall, this.props));
      }

      render() {
        const props = {
          ...this.props,
          [propName]: { ...this.props[propName], fetch: this.fetch },
        };

        return <InnerComponent {...props} />;
      }
    }

    Wrapper.displayName = `Query(${propName}, ${getDisplayName(InnerComponent)})`;

    const mapStateToProps = (state, props) => {
      const argumentsAbsorber = (...args) => args;

      return {
        [propName]: getRequestInfo(
          state,
          apiCall,
          dispatcher(argumentsAbsorber, props),
        ),
      };
    };

    return connect(mapStateToProps)(Wrapper);
  };
}
