import request from './request';
import applyUrlWithPlaceholders from './applyUrlWithPlaceholders';

const defaultConfigure = (options) => options;

export default function buildApi(endpoints, config = {}) {
  const {
    baseUrl,
    configureOptions = defaultConfigure,
    configureHeaders = defaultConfigure,
  } = config;

  return Object.keys(endpoints).reduce((acc, key) => {
    const { path, method: normalizeArguments } = endpoints[key];

    const requiredPlaceholders = [];
    const placeholderRegexp = /:([^\/$]+)/g;
    let match;

    while (match = placeholderRegexp.exec(path)) {
      requiredPlaceholders.push(match[1]);
    }

    acc[key] = (...args) => {
      const normalizedArguments = normalizeArguments(...args);

      const placeholders = normalizedArguments.placeholders || {};
      const options = normalizedArguments.options || {};

      const augmentedOptions = {
        ...options,
        headers: configureHeaders({
          ...options.headers,
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json',
        }),
      };

      const callable = requiredPlaceholders.every(key => placeholders[key]);

      if (!callable) {
        return { type: '@BEESNOOP' };
      }

      const req = request(
        baseUrl,
        applyUrlWithPlaceholders(path, placeholders),
        configureOptions(augmentedOptions)
      );

      req.actionName = key;
      req.params = args;

      return req;
    };

    acc[key].actionName = key;

    return acc;
  }, {});
};
