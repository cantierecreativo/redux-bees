import immutable from 'object-path-immutable';

const initialState = {};

export default function reducer(state = initialState, action) {
  if (action.type === 'requests/invalidate') {
    const { actionName, params } = action.payload;

    if (params) {
      if (state[actionName] && state[actionName][JSON.stringify(params)]) {
        return immutable.set(
          state,
          [actionName, JSON.stringify(params), 'invalid'],
          true,
        );
      }
    } else if (state[actionName]) {
      return Object.keys(state[actionName]).reduce((acc, params) => {
        return immutable.set(
          acc,
          [actionName, params, 'invalid'],
          true,
        );
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
      const { data } = action.payload.body;

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

