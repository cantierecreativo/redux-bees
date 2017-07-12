# redux-bees 

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
//           }
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
//           }
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
call** made to the `api.getPosts` endpoint. If you just want to invalidate a specific
API call, pass the call parameters as second argument:

```
dispatch(invalidateRequests(api.getPosts, [{ page: '2' }]));
```

## License

ISC
