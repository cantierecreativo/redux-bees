import immutable from 'object-path-immutable';

const initialState = {};

export default function reducer(state = initialState, action) {
  if (action.type === 'requests/invalidate') {
    return immutable.del(
      state,
      action.payload.name,
    );
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

    return newState;

  } else if (metaType === 'response' && action.payload) {
    let newState = state;
    const { data } = action.payload;

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

    // newState = immutable.set(
    //   newState,
    //   [action.type, JSON.stringify(params), 'totalCount'],
    //   parseInt(headers['x-total'], 10),
    // );

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
      [name, JSON.stringify(params), 'error'],
      action.payload,
    );

    return newState;
  }

  return state;
}

