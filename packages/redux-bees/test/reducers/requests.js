import test from 'tape';
import requestsReducer from '../../src/reducers/requests';

test('requests reducer', (c) => {
  const initialState = {}
  const resource = {
    id: '12',
    type: 'post',
    attributes: {
      title: 'Hello, world!',
    },
  };

  c.test('ignores actions without .meta.api', (t) => {
    const action = { type: 'foo' };
    const state = requestsReducer(initialState, action);
    t.equal(state, initialState);
    t.end();
  });

  c.test('with actions of type request', (t) => {
    const meta = { api: true, type: 'request', name: 'getPost', params: ['12'] };
    const action = { type: 'api/getPost/request', meta };

    const initialState = {
      getPost: {
        '["12"]': {
          response: '12',
          error: null,
          isLoading: false,
          invalid: true,
        },
      },
    };

    const state = requestsReducer(initialState, action);

    t.deepEqual(
      state,
      {
        getPost: {
          '["12"]': { error: null, isLoading: true, response: '12' }
        }
      }
    );

    t.end();
  });

  c.test('with actions of type response', (t) => {
    const meta = { api: true, type: 'response', name: 'getPost', params: ['12'] };
    const action = {
      type: 'api/getPost/request',
      meta,
      payload: {
        status: 200,
        headers: {},
        body: { data: [resource] }
      },
    };

    const initialState = {
      getPost: {
        '["12"]': {
          error: null,
          isLoading: true,
        },
      },
    };

    const state = requestsReducer(initialState, action);

    t.deepEqual(
      state,
      {
        getPost: {
          '["12"]': {
            error: null,
            isLoading: false,
            response: [ { id: '12', type: 'post' } ],
            status: 200,
            headers: {},
          },
        },
      }
    );

    t.end();
  });

  c.test('with actions of type error', (t) => {
    const meta = { api: true, type: 'error', name: 'getPost', params: ['12'] };

    const initialState = {
      getPost: {
        '["12"]': {
          error: null,
          isLoading: true,
        },
      },
    };

    t.deepEqual(
      requestsReducer(
        initialState,
        {
          type: 'api/getPost/request',
          meta,
          payload: {
            body: 'foobar',
            status: 404,
            headers: {},
          },
        }
      ),
      {
        getPost: {
          '["12"]': {
            error: 'foobar',
            response: null,
            isLoading: false,
            status: 404,
            headers: {}
          },
        },
      }
    );

    t.deepEqual(
      requestsReducer(
        initialState,
        {
          type: 'api/getPost/request',
          meta,
          payload: new TypeError('cannot fetch'),
        }
      ),
      {
        getPost: {
          '["12"]': {
            error: 'cannot fetch',
            response: null,
            isLoading: false,
          },
        },
      }
    );

    t.end();
  });
});

