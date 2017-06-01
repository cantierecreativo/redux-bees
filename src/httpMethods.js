// options
// placeholders, options

export const get = function get(placeholders = {}, options = {}) {
  return {
    placeholders,
    options,
  };
};

// placeholders, body, options
// body, options
// body

export const post = function post(...args) {
  const placeholders = args.length >= 3 ? args[0] : {};
  const body = args.length >= 3 ? args[1] : args[0];
  const options = args.length >= 2 ? args[args.length - 1] : {};

  return {
    placeholders,
    options: {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(body),
      ...options,
    }
  };
};

// placeholders, body, options
// body, options
// body

export const patch = function patch(...args) {
  const placeholders = args.length >= 3 ? args[0] : {};
  const body = args.length >= 3 ? args[1] : args[0];
  const options = args.length >= 2 ? args[args.length - 1] : {};

  return {
    placeholders,
    options: {
      method: 'PATCH',
      mode: 'cors',
      body: JSON.stringify(body),
      ...options,
    }
  };
};

// options
// placeholders, options

export const destroy = function destroy(...args) {
  const placeholders = args.length >= 2 ? args[0] : {};
  const options = args.length >= 2 ? args[1] : args[0];

  return {
    placeholders,
    options: {
      method: 'DELETE',
      mode: 'cors',
      ...options,
    },
  };
};

