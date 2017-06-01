import fetch from 'node-fetch';

function request(url, options = {}) {
  console.log(url, options);
  return fetch(url, options)
    .then((res) => {
      if (res.status !== 204) {
        return res.json().then(body => [res, body]);
      }
      return Promise.resolve([res, null]);
    })
    .then(([res, body]) => {
      if (res.status >= 200 && res.status < 300) {
        return Promise.resolve(body);
      }
      return Promise.reject(body);
    });
};

function generateUrl(url, placeholders) {
  return Object.keys(placeholders).reduce((acc, key) => (
    acc.replace(`:${key}`, placeholders[key])
  ), url);
}

// options
// placeholders, options

export const get = function get(url, ...args) {
  const placeholders = args.length >= 2 ? args[0] : {};
  const options = args.length >= 2 ? args[1] : args[0];

  return request(
    generateUrl(url, placeholders),
    options
  );
};

// placeholders, body, options
// body, options
// body

export const post = function post(url, ...args) {
  const placeholders = args.length >= 3 ? args[0] : {};
  const body = args.length >= 3 ? args[1] : args[0];
  const options = args.length >= 2 ? args[args.length - 1] : {};

  return request(
    generateUrl(url, placeholders),
    {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(body),
      ...options,
    },
  );
};

// placeholders, body, options
// body, options
// body

export const patch = function patch(url, ...args) {
  const placeholders = args.length >= 3 ? args[0] : {};
  const body = args.length >= 3 ? args[1] : args[0];
  const options = args.length >= 2 ? args[args.length - 1] : {};

  return request(
    generateUrl(url, placeholders),
    {
      method: 'PATCH',
      mode: 'cors',
      body: JSON.stringify(body),
      ...options,
    },
  );
};

// options
// placeholders, options

export const destroy = function destroy(url, ...args) {
  const placeholders = args.length >= 2 ? args[0] : {};
  const options = args.length >= 2 ? args[1] : args[0];

  return request(
    generateUrl(url, placeholders),
    {
      method: 'DELETE',
      mode: 'cors',
      ...options,
    },
  );
};

