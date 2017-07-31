import immutable from 'object-path-immutable';

const initialState = {};

export default function reducer(state = initialState, action) {
  if (!action.meta || !action.meta.api) {
    return state;
  }

  const { type: metaType } = action.meta;

  if (metaType === 'response' && action.payload && action.payload.body) {
    let newState = state;
    const { data, included, meta } = action.payload.body;

    let items;

    if (Array.isArray(data)) {
      items = data;
    } else if (data) {
      items = [data];
    } else {
      items = [];
    }

    if (Array.isArray(included)) {
      items = items.concat(included);
    }

    newState = items.reduce((acc, item) => (
      immutable.set(
        acc,
        [item.type, item.id],
        item,
      )
    ), newState);

    if (meta) {
      newState = immutable.set(newState, 'meta', meta);
    }

    return newState;
  }

  return state;
}

