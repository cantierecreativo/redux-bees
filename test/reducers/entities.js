import test from 'tape';
import entitiesReducer from '../../src/reducers/entities';

test('entities reducer', (c) => {
  const initialState = {}
  const meta = { api: true, type: 'response' };
  const resource = {
    id: '12',
    type: 'post',
    attributes: {
      title: 'Hello, world!',
    },
  };

  c.test('ignores actions without .meta.api', (t) => {
    const action = { type: 'foo' };
    const state = entitiesReducer(initialState, action);
    t.equal(state, initialState);
    t.end();
  });

  c.test('ignores actions with .meta.type different than "response"', (t) => {
    const action = { meta: { api: true, type: 'request' } };
    const state = entitiesReducer(initialState, action);
    t.equal(state, initialState);
    t.end();
  });

  c.test('ignores actions with empty payload (ie. 204 responses)', (t) => {
    const action = { meta: { api: true, type: 'response' } };
    const state = entitiesReducer(initialState, action);
    t.equal(state, initialState);
    t.end();
  });

  c.test('handles data when it\'s a single resource', (t) => {
    const action = { payload: { body: { data: resource } }, meta };
    const state = entitiesReducer(initialState, action);

    t.deepEqual(
      state,
      { post: { 12: resource } }
    );

    t.end();
  });

  c.test('handles data when it\'s a collection of resources', (t) => {
    const action = { payload: { body: { data: [resource] } }, meta };
    const state = entitiesReducer(initialState, action);

    t.deepEqual(
      state,
      { post: { 12: resource } }
    );

    t.end();
  });

  c.test('handles compound documents', (t) => {
    const action = { payload: { body: { included: [resource] } }, meta };
    const state = entitiesReducer(initialState, action);

    t.deepEqual(
      state,
      { post: { 12: resource } }
    );

    t.end();
  });
});
