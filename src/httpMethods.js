// placeholders
// placeholders, options

export const get = function get(placeholders = {}, options = {}) {
  return {
    placeholders,
    options,
  };
};

// body
// placeholders, body
// placeholders, body, options

export const post = function post(...args) {
  const placeholders = args.length >= 2 ? args[0] : {};
  const body = args.length >= 2 ? args[1] : args[0];
  const options = args.length == 3 ? args[2] : {};

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

// body
// placeholders, body
// placeholders, body, options

export const patch = function patch(...args) {
  const placeholders = args.length >= 2 ? args[0] : {};
  const body = args.length >= 2 ? args[1] : args[0];
  const options = args.length == 3 ? args[2] : {};

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

// body
// placeholders, body
// placeholders, body, options

export const put = function patch(...args) {
  const placeholders = args.length >= 2 ? args[0] : {};
  const body = args.length >= 2 ? args[1] : args[0];
  const options = args.length == 3 ? args[2] : {};

  return {
    placeholders,
    options: {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(body),
      ...options,
    }
  };
};

// placeholders
// placeholders, options

export const destroy = function destroy(placeholders = {}, options = {}) {
  return {
    placeholders,
    options: {
      method: 'DELETE',
      mode: 'cors',
      ...options,
    },
  };
};

