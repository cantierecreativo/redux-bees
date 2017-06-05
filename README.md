# redux-bees 

A nice, declarative way of managing JSON API calls with Redux

## Installation

```sh
npm install redux-bees --save
```

Or if you use Yarn:

```sh
yarn add redux-bees
```

# Usage

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
  //   data: [
  //     {
  //       id: 413,
  //       type: 'posts',
  //       attributes: {
  //         title: 'My awesome post',
  //         ...
  //       }
  //     }
  //   ]
  // }
})
.catch((error) => {
  // {
  //   errors: [
  //     {
  //       status: '404',
  //       title:  'Resource not found',
  //       ...
  //     }
  //   ]
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

api.getComments({ postId: 12 }
// GET https://api.yourservice.com/posts/12/relationships/comments

api.createComment({ postId: 12 }, { data: { type: 'comment', attributes: { ... }}})
// POST https://api.yourservice.com/posts/12/relationships/comments
```

### Customize headers

By default, API calls will have the following headers setup for you:

```
Content-Type: application/vnd.api+json
Accept application/vnd.api+json
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

This will enable you to dispatch API calls, and get back the result from your 
Redux state using one of these selectors:

* `getRequestResult(state, apiCall, args)`
* `isRequestLoading(state, apiCall, args)`
* `hasRequestStarted(state, apiCall, args)`
* `getRequestError(state, apiCall, args)`

If you want to retrieve all of the above info at once, you can use the following shortcut selector:

* `getRequestInfo(state, apiCall, args)`

Example: 

```js
import {
  getRequestResult,
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
//   error: null
// }

setTimeout(() => {
  getRequestInfo(store.getState(), api.getPost, [{ id: 12 }]);
  // {
  //   hasStarted: true,
  //   isLoading: false,
  //   hasFailed: false,
  //   result: { id: 12, type: 'post', attributes: { ... } },
  //   error: null
  // }
}, 2000);
```

The current state of your API calls will be saved in store in the following, 
normalized form:

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
//         }
//       }
//       getPost: {
//         '[ { "id": 12 } ]': {
//           isLoading: false,
//           error: null,
//           response: { id: '12', type: 'post' },
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
a specific higher-order component called `query`. 

Example of usage: 

```js
import React from 'react';
import api from './api';
import { query } from 'redux-bees';

@query('post', api.getPost, (call, props) => call({ id: props.match.params.id }))

export default class App extends React.Component {
  render() {
    const { post, status } = this.props;

    return (
      <div>
        {
          !status.post.hasStarted &&
            'Request not started...'
        }
        {
          status.post.isLoading &&
            'Loading...'
        }
        {
          status.post.hasFailed &&
            JSON.stringify(status.post.error)
        }
        {
          post &&
            JSON.stringify(post)
        }
      </div>
    );
  }
}
```

The `query` HOC takes the following ordinal arguments: 

* the name of the prop that will be passed down to the component (ie. `'post'`);
* the API call to dispatch (ie. `api.getPost`);
* the function that will be used to actually dispatch the API call with the correct arguments.

The HOC will always add a `status` prop, containing all the info about the API request.

## License

ISC
