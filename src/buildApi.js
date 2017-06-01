const defaultConfigure = (options) => options;

export default function buildApi(endpoints, config = {}) {
  const {
    baseUrl,
    configureOptions = defaultConfigure,
    configureHeaders = defaultConfigure,
  } = config;

  return Object.keys(endpoints).reduce((acc, key) => {
    const { path, method: request } = endpoints[key];

    acc[key] = (...args) => {
      const options = {
        headers: configureHeaders({
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json',
        }),
      };

      const req = request(
        baseUrl + path,
        ...args,
        configureOptions(options)
      );

      req.actionName = key;
      req.params = args;

      return req;
    };

    acc[key].actionName = key;

    return acc;
  }, {});
};
