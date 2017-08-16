import React from 'react';
import { createServer } from 'http';
import ReactDOMServer from 'react-dom/server';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import fetch from 'node-fetch';

global.fetch = fetch;

import createStore from './createStore';
import App from './components/App';

const routes = [
  {
    component: App,
    path: '/'
  },
];

createServer((req, res) => {
  const store = createStore();
  const branch = matchRoutes(routes, req.url);

  const promises = branch.map(({ route, match }) => {
    return route.component.loadData ?
      route.component.loadData(store.dispatch, { match }) :
      Promise.resolve(null);
  });

  Promise.all(promises)
  .then(() => {
    const html = ReactDOMServer.renderToStaticMarkup(
      <Provider store={store}>
        <App />
      </Provider>
    );

    res.write(`<!doctype html><div id="app">${html}</div>`);
    res.end();
  });
}).listen(3000);
