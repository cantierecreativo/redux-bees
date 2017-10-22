/**
 * Runs the redux-bees api request.
 * The baseUrl can also be a function which is assessed at runtime.
 *
 * @param {String|Function} baseUrl
 * @param {String} path
 * @param {Object} options
 * @return {Promise}
 */

export default function request(baseUrl, path, options) {
  const url = (typeof baseUrl === 'function' ? baseUrl() : baseUrl) + path
  return fetch(url, options)
    .then((res) => {
      const headers = {};
      res.headers.forEach((value, name) => headers[name] = value);

      const response = {
        status: res.status,
        headers,
      };

      if (res.status !== 204) {
        return res.json().then(body => ({ ...response, body }));
      }

      return Promise.resolve(response);
    })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
      }

      return Promise.reject(response);
    });
};

