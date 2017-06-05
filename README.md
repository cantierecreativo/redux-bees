e redux-bees 

A nice, declarative way of managing [JSON API](http://jsonapi.org/) calls with Redux.

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

## State selectors

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
normalized form. The `bees` section of the store should be considered a private
area and should be accessed via our state selectors.

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

Basic example of usage: 

```js
import React from 'react';
import api from './api';
import { query } from 'redux-bees';

@query('posts', api.getPosts)

export default class App extends React.Component {
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

The `query` HOC takes the following ordinal arguments: 

* The name of the prop that will be passed down to the component (ie. `'post'`);
* The API call to dispatch (ie. `api.getPost`);

The HOC will always add a `status` prop, containing all the info about the API request.

If the API call needs parameters (for example, to get a single post), you pass a third argument:

```js
import React from 'react';
import api from './api';
import { query } from 'redux-bees';

@query('post', api.getPost, (perform, props) => perform({ id: props.match.params.id }))

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

In this example, the function `(perform, props) => perform({ id: props.match.params.id })` will be used to actually dispatch the API call with the correct arguments. 

You can decorate your component with multiple `@query` HOCs:

```js
import React from 'react';
import api from './api';
import { query } from 'redux-bees';

@query('post', api.getPost, (perform, props) => perform({ id: props.match.params.id }))

@query('comments', api.getComments, (perform, props) => perform({ postId: props.post && props.post.id }))

export default class App extends React.Component {
  render() {
    //...
  }
}
```

In this case, `status.post` indicates the status of the `api.getPost` API call, and `status.comments` indicates the status of the `api.getComments` call.

## Dependent data loading

Consider this case: 

```js
@query('post', api.getPost, (perform, props) => perform({ id: props.match.params.id }))

@query('category', api.getCategory, (perform, props) => (
  perform({ id: props.post && props.post.relationships.category.data.id })
))
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

Marvellous!! :v::v:

## License

ISC
