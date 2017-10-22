import immutable from 'object-path-immutable';

const invalidate = (state, actionName, key) => (
  immutable.set(state, [actionName, key, 'invalid'], true)
);

const initialState = {};

export default function reducer(state = initialState, action) {
  if (action.type === 'requests/invalidate') {
    const { actionName, params } = action.payload;

    if (!state[actionName]) {
      return state;
    }

    if (params && typeof params === 'function') {
      return Object.keys(state[actionName]).reduce((acc, key) => {
        if (params(...JSON.parse(key))) {
          return invalidate(acc, actionName, key);
        } else {
          return acc;
        }
      }, state);
    } else if (params && state[actionName][JSON.stringify(params)]) {
      return invalidate(state, actionName, JSON.stringify(params));
    } else if (!params) {
      return Object.keys(state[actionName]).reduce((acc, key) => {
        return invalidate(acc, actionName, key);
      }, state);
    }

    return state;
  }

  if (!action.meta || !action.meta.api) {
    return state;
  }

  const { type: metaType, name, params } = action.meta;

  if (metaType === 'request') {
    let newState = state;

    newState = immutable.set(
      newState,
      [name, JSON.stringify(params), 'isLoading'],
      true,
    );

    newState = immutable.set(
      newState,
      [name, JSON.stringify(params), 'error'],
      null,
    );

    newState = immutable.del(
      newState,
      [name, JSON.stringify(params), 'invalid'],
    );

    return newState;

  } else if (metaType === 'response' && action.payload) {
    let newState = state;

    if (action.payload.body) {
      const { data, meta } = action.payload.body;

      let normalizedData;

      if (Array.isArray(data)) {
        normalizedData = data.map(record => ({ id: record.id, type: record.type }));
      } else if (data && data.id) {
        normalizedData = { id: data.id, type: data.type };
      } else {
        normalizedData = null;
      }

      newState = immutable.set(
        newState,
        [name, JSON.stringify(params), 'response'],
        normalizedData,
      );

      if (meta) {
        newState = immutable.set(
          newState,
          [name, JSON.stringify(params), 'meta'],
          meta
        );
      }
    }

    newState = immutable.set(
      newState,
      [name, JSON.stringify(params), 'headers'],
      action.payload.headers,
    );

    newState = immutable.set(
      newState,
      [name, JSON.stringify(params), 'status'],
      action.payload.status,
    );

    newState = immutable.set(
      newState,
      [name, JSON.stringify(params), 'isLoading'],
      false,
    );

    return newState;
  } else if (metaType === 'error') {
    let newState = state;

    newState = immutable.set(
      newState,
      [name, JSON.stringify(params), 'isLoading'],
      false,
    );

    newState = immutable.set(
      newState,
      [name, JSON.stringify(params), 'response'],
      null,
    );

    if (action.payload instanceof Error) {

      newState = immutable.set(
        newState,
        [name, JSON.stringify(params), 'error'],
        action.payload.message
      );

      newState = immutable.del(
        newState,
        [name, JSON.stringify(params), 'headers'],
      );

      newState = immutable.del(
        newState,
        [name, JSON.stringify(params), 'status'],
      );

    } else {

      newState = immutable.set(
        newState,
        [name, JSON.stringify(params), 'error'],
        action.payload.body
      );

      newState = immutable.set(
        newState,
        [name, JSON.stringify(params), 'headers'],
        action.payload.headers,
      );

      newState = immutable.set(
        newState,
        [name, JSON.stringify(params), 'status'],
        action.payload.status,
      );
    }

    return newState;
  }

  return state;
}

