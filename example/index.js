import createStore from './createStore';
import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import App from './components/App';

ReactDOM.render(
  <Provider store={createStore()}>
    <App />
  </Provider>,
  document.getElementById('root')
);

