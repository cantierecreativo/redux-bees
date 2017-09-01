![redux-bees](https://raw.githubusercontent.com/cantierecreativo/redux-bees/master/logo.png)

A nice, declarative way of managing [JSON API](http://jsonapi.org/) calls with Redux.

![downloads](https://img.shields.io/npm/dm/redux-bees.svg)

## Installation

```sh
npm install redux-bees --save
```

Or if you use Yarn:

```sh
yarn add redux-bees
```

This library makes use of the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to make AJAX requests, 
so make sure to add a polyfill if your execution environment is not equipped with it.

# Usage

* [Defining your API endpoints](#defining-your-api-endpoints)
  * [Customize headers](#customize-headers)
  * [Dynamic change of baseUrl](#dynamic-change-of-baseurl)
  * [Resolve/reject middlewares](#resolvereject-middlewares)
* [Redux integration](#redux-integration)
* [State selectors](#state-selectors)
* [React integration](#react-integration)
* [Conditional fetch](#conditional-fetch)
* [Dependent data loading](#dependent-data-loading)
* [Retrieving compound documents](#retrieving-compound-documents)
* [Forced refetch](#forced-refetch)
* [Cache invalidation](#cache-invalidation)
* [Server-side data loading](#server-side-data-loading)

## Defining your API endpoints

Start by defining the endpoints of your API:

```js
import { buildApi, get, post, patch, destroy } from 'redux-bees';

const apiEndpoints = {
  getPosts:      { method: get,     path: '/posts' },
  getPost:       { method: get,     path: '/posts/:id' },
  createPost:    { method: post,    path: '/posts' },
  updatePost:    { method: patch,   path: '/posts/:id' },
  destroyPost:   { method: destroy, path: '/posts/:id' },
  getCategory:   { method: get,     path: '/categories/:id' },
  getComments:   { method: get,     path: '/posts/:postId/relationships/comments' },
  createComment: { method: post,    path: '/posts/:postId/relationships/comments' },
};

const config = {
  baseUrl: 'https://api.yourservice.com'
};

const api = buildApi(apiEndpoints, config);
```

You can then perform API requests like this:

```js
api.getPosts()
.then((result) => {
  // {
  //   status: 200,
  //   headers: {
  //     'content-type': 'application/vnd.api+json'
  //   },
  //   body: {
  //     data: [
  //       {
  //         id: 413,
  //         type: 'posts',
  //         attributes: {
  //           title: 'My awesome post',
  //           ...
  //         }
  //       }
  //     ]
  //   }
  // }
})
.catch((error) => {
  // {
  //   status: 404,
  //   headers: {
  //     'content-type': 'application/vnd.api+json'
  //   },
  //   body: {
  //     errors: [
  //       {
  //         status: '404',
  //         title:  'Resource not found',
  //         ...
  //       }
  //     ]
  //   }
  // }
});
```

The arguments you need to pass depend on the HTTP method of the request and
the presence of placeholders in the path declared for the endpoint:

```js
api.getPost({ id: 12 })
// GET https://api.yourservice.com/posts/12

api.getPost({ id: 12, include: 'comments' })
// GET https://api.yourservice.com/posts/12?include=comments

api.createPost({ data: { type: 'post', attributes: { ... }}})
// POST https://api.yourservice.com/posts

api.updatePost({ id: 12 }, { data: { id: 12, type: 'post', attributes: { ... }}})
// PATCH https://api.yourservice.com/posts/12

api.destroyPost({ id: 12 })
// DELETE https://api.yourservice.com/posts/12

api.getComments({ postId: 12 })
// GET https://api.yourservice.com/posts/12/relationships/comments

api.createComment({ postId: 12 }, { data: { type: 'comment', attributes: { ... }}})
// POST https://api.yourservice.com/posts/12/relationships/comments
```

If you perform multiple concurrent requests to the same endpoint with the same
parameters, a single API call will be performed, and every request will be
attached to the same promise:

```js
api.getPost({ id: 12 })
.then(data => console.log(data));

// This won't produce a new API call

api.getPost({ id: 12 })
.then(data => console.log(data));
```

### Customize headers

By default, API calls will have the following headers setup for you:

```
Content-Type: application/vnd.api+json
Accept: application/vnd.api+json
```

If you need to pass additional headers, you can use the `configureHeaders` option:

```js
import store from './store';

const config = {
  baseUrl: 'https://api.yourservice.com'
  configureHeaders(headers) {
    return {
      ...headers,
      'Authorization': `Bearer ${store.getState().session.bearerToken}`,
    };
  },
};
```

### Dynamic change of baseUrl

In some applications the URL Endpoint may change during runtime. To help with this scenario the baseUrl config option can either be a `String` or `Function`:

```js
import store from './store';

const config = {
  baseUrl() {
    return store.getState().app.endpoint;
  }
};
```

### Resolve/reject middlewares

If you need to execute specific code after every request, or to tweak the response you get from the server, you can use the `afterResolve` and `afterReject` options:

```js
import camelcaseKeys from 'camelcase-keys'

const config = {
  baseUrl: 'https://api.yourservice.com',
  afterResolve({ status, headers, body }) {
    return Promise.resolve({ status, headers, body: camelcaseKeys(body) });
  },
  afterReject({ status, headers, body }) {
    if (status === 401) {
      // ie. redirect to login page
      document.location = '/login';
    } else {
      return Promise.reject({ status, headers, body: camelcaseKeys(body) });
    }
  },
};
```

## Redux integration

To integrate `redux-bees` with your Redux store, you need to add a reducer and
a middleware:

```js
import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from 'redux';

import {
  reducer as beesReducer,
  middleware as beesMiddleware,
} from 'redux-bees';

const reducer = combineReducers({
  // ...your other reducers
  bees: beesReducer,
});

const store = createStore(
  reducer,
  applyMiddleware(beesMiddleware())
);
```

## State selectors

This will enable you to dispatch API calls, and get back the result from your
Redux state using one of these selectors:

* `getRequestResult(state, apiCall, args)`
* `getRequestHeaders(state, apiCall, args)`
* `getRequestMeta(state, apiCall, args)`
* `isRequestLoading(state, apiCall, args)`
* `hasRequestStarted(state, apiCall, args)`
* `getRequestError(state, apiCall, args)`

If you want to retrieve all of the above info at once, you can use the following shortcut selector:

* `getRequestInfo(state, apiCall, args)`

Example:

```js
import {
  getRequestResult,
  getRequestHeaders,
  getRequestMeta,
  isRequestLoading,
  hasRequestStarted,
  getRequestError,
  getRequestInfo,
} from 'redux-bees';

store.dispatch(api.getPost({ id: 12 }));

getRequestInfo(store.getState(), api.getPost, [{ id: 12 }]);
// {
//   hasStarted: false,
//   isLoading: false,
//   hasFailed: false,
//   result: null,
//   headers: null,
//   meta: null,
//   error: null
// }

setTimeout(() => {
  getRequestInfo(store.getState(), api.getPost, [{ id: 12 }]);
  // {
  //   hasStarted: true,
  //   isLoading: false,
  //   hasFailed: false,
  //   headers: {
  //     'content-type': 'application/vnd.api+json'
  //   },
  //   meta: {
  //     'responseTimeInMs': 69
  //   },
  //   result: { id: 12, type: 'post', attributes: { ... } },
  //   error: null
  // }
}, 2000);
```

The current state of your API calls will be saved in store in the following,
normalized form. The `bees` section of the store should be considered a private
area and should be accessed via our [state selectors](#state-selectors).

```js
store.getState();

// {
//   bees: {
//     requests: {
//       getPosts: {
//         '[]': {
//           isLoading: false,
//           error: null,
//           response: [ { id: '12', type: 'post' } ],
//           status: 200,
//           headers: {
//             'content-type': 'application/vnd.api+json'
//           },
//           meta: null,
//         }
//       }
//       getPost: {
//         '[ { "id": 12 } ]': {
//           isLoading: false,
//           error: null,
//           response: { id: '12', type: 'post' },
//           status: 200,
//           headers: {
//             'content-type': 'application/vnd.api+json'
//           },
//           meta: null,
//         }
//       }
//     },
//     entities: {
//       post: {
//         '12': {
//           id: '12',
//           type: 'site',
//           attributes: {
//             name: 'My awesome post',
//             ...
//           }
//         }
//       }
//     }
//   }
// }
```

## React integration

To make it easier to integrate data fetching in your component, you can use
a specific higher-order component called `query`. Basic example of usage:

```js
import React from 'react';
import api from './api';
import { query } from 'redux-bees';

@query('posts', api.getPosts)

export default class App extends React.Component {

  static propTypes = {
    posts: PropTypes.array,
    status: PropTypes.shape({
      posts: PropTypes.shape({
        hasStarted: PropTypes.bool.isRequired,
        isLoading: PropTypes.bool.isRequired,
        hasFailed: PropTypes.bool.isRequired,
        refetch: PropTypes.func.isRequired,
        headers: PropTypes.object,
        meta: PropTypes.object,
        error: PropTypes.object,
      }),
    }),
  };

  render() {
    const { posts, status } = this.props;

    return (
      <div>
        {
          !status.posts.hasStarted &&
            'Request not started...'
        }
        {
          status.posts.isLoading &&
            'Loading...'
        }
        {
          status.posts.hasFailed &&
            JSON.stringify(status.posts.error)
        }
        {
          posts &&
            JSON.stringify(posts)
        }
      </div>
    );
  }
}
```

The HOC takes the following ordinal arguments:

* The name of the prop that will be passed down to the component (ie. `'post'`);
* The API call to dispatch (ie. `api.getPost`);

The HOC will always pass down a `status` prop, containing all the info about the API request.

If the API call needs parameters (for example, to get a single post), you pass a third argument:

```js
@query('post', api.getPost, (perform, props) => (
  perform({ id: props.match.params.id })
))
```

The function `(perform, props) => perform(...)` will be used to actually dispatch the API call with the correct arguments.

You can decorate your component with multiple `@query` HOCs:

```js
@query('post', api.getPost, (perform, props) => (
  perform({ id: props.match.params.id })
))

@query('comments', api.getComments, (perform, props) => (
  perform({ postId: props.match.params.id })
))

export default class App extends React.Component {
  render() {
    //...
  }
}
```

In this case, `this.props.status.post` indicates the status of the `api.getPost` API call, and `this.props.status.comments` indicates the status of the `api.getComments` call.

## Conditional fetch

Your component might require to fetch data conditionally (ie. only if some parameter is present in the URL). In this case, you can use [recompose's `@branch` HOC](https://github.com/acdlite/recompose/blob/master/docs/API.md#branch) to apply the `@query` HOC only when needed:

```js
import React from 'react';
import { query } from 'redux-bees';
import { branch } from 'recompose';
import api from './api';

@branch(
  (props) => props.showPopularPosts,
  query('popularPosts', api.getPosts, (perform) => (
    perform({ 'page[size]': 10, sort: 'pageViews', direction: 'desc' })
  ))
)

export default class App extends React.Component {
  // ...
```

## Dependent data loading

Consider this case:

```js
@query('post', api.getPost, (perform, props) => (
  perform({ id: props.match.params.id })
))

@query('category', api.getCategory, (perform, props) => (
  perform({ id: props.post && props.post.relationships.category.data.id })
))

export default class App extends React.Component {
  render() {
    //...
  }
}
```

The `api.getCategory` call cannot be made until we receive the `post`. `redux-bees` handles this automatically: the call is only made when `props.post && props.post.relationships.category.data.id` returns a value. This is because in this API call the `id` parameter is considered required, as it is indicated with a placeholder:

```
  ...
  getCategory:   { method: get, path: '/categories/:id' },
  ...
```

If your API call requires specific parameters in the query string, they can be declared as follows:

```
  ...
  getPosts:   { method: get, path: '/posts', required: [ 'page' ] },
  ...
```

## Retrieving compound documents

To reduce the number of HTTP requests, JSON API servers [may allow responses
that include related resources along with the requested primary resources](http://jsonapi.org/format/#document-compound-documents) using the `include` query string.

You can access included entities with the `getRelationship` selector:

```js
import { query, getRelationship } from 'redux-bees';
import { connect } from 'react-redux';

import api from './api';

@query('post', api.getPost, (perform, props) => (
  perform({ id: props.match.params.id, include: 'categories' })
))

@connect((state, props) => ({
  categories: getRelationship(state, props.post, 'categories')
}))

export default class App extends React.Component {
  render() {
    //...
  }
}
```

## Forced refetch

The `status` prop contains an `refetch()` function you can use when you need
to force a refetch of data:

```js
import React from 'react';
import api from './api';
import { query } from 'redux-bees';

@query('posts', api.getPosts)

export default class App extends React.Component {
  componentDidMount() {
    const { status } = this.props;

    setTimeout(() => {
      status.posts.refetch();
    }, 2000);
  }

  render() {
    const { posts } = this.props;

    return (
      <div>
        { posts && JSON.stringify(posts) }
      </div>
    );
  }
}
```

## Cache invalidation

After some destructive call (ie. creation of a new post), you often need to
invalidate one or more API calls that may have been previously made (ie. the
index of posts).

In this case, you can dispatch the `invalidateRequests` action:

```js
import React from 'react';
import api from './api';
import { query, invalidateRequests } from 'redux-bees';

@query('posts', api.getPosts)

export default class App extends React.Component {

  handleSubmit(attributes) {
    const { dispatch } = this.props;

    dispatch(api.createPost({
      data: {
        type: 'post',
        attributes,
      }
    }))
    .then(() => {
      dispatch(invalidateRequests(api.getPosts));
    });
  }
}
```

Calling `invalidateRequests(api.getPosts)` will invalidate **every previous API
call** made to the `api.getPosts` endpoint. 

To invalidate only a subset of the previously API calls made, you can pass a function 
as second argument that will act as a filter:

```js
dispatch(invalidateRequests(api.getPost, (params) => params.id === 2));
```


## Server-side data loading

We seek to be composable with any approach, and not prescribe or lean toward any specific routing solution. 

Components wrapped in a `@query` HOC expose a static function called `loadData` which accepts a redux `dispatch` function as first argument. It returns a Promise that resolves once data is loaded and saved to your Redux store.

The server (with the help of [react-router](https://reacttraining.com/react-router/web/guides/server-rendering) or something similar) then checks which components match the route path and calls all of the `loadData` static functions if they're available.

When all of these promises have been resolved, the server side can render the components and finish the request.

Here's a simple example using [`react-router`](https://github.com/ReactTraining/react-router) and [`react-router-config`](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config):

```js
import React from 'react';
import { query } from 'redux-bees';
import api from './api';

@query('posts', api.getPosts)
export default class App extends React.Component {
  // ...
}
```

```js
import { createServer } from 'http';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { matchRoutes } from 'react-router-config';
import { Provider } from 'react-redux';

import createStore from './createStore';
import App from './components/App';

const routes = [
  {
    component: App,
    path: '/'
  },
  // etc.
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
    const html = ReactDOMServer.renderToString(
      <Provider store={store}>
        <App />
      </Provider>
    );

    res.write(`<!doctype html><div id="app">${html}</div>`);
    res.end();
  });
}).listen(3000);
```

# Who uses redux-bees

If your company or project uses `redux-bees`, feel free to add it to [the official list of users](https://github.com/cantierecreativo/redux-bees/wiki/Sites-using-redux-bees) by [editing](https://github.com/cantierecreativo/redux-bees/wiki/Sites-using-redux-bees/_edit) the wiki page.

# Feedback wanted

Project is still in the early stages. Please file an issue or submit a PR if you have suggestions! Or ping me (Stefano Verna) on [Twitter](https://twitter.com/steffoz).

# Why is it called `redux-bees`?

We're italians. Italian translation of "bees" is "api". See what we did there? :hamster:

# License

ISC
