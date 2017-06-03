import queryString from 'query-string';

export default function applyUrlWithPlaceholders(url, placeholders) {
  const query = {};

  const completeUrl = Object.keys(placeholders).reduce((acc, key) => {
    const token = `:${key}`;

    if (acc.indexOf(token) !== -1) {
      return acc.replace(token, placeholders[key])
    }

    if (placeholders[key]) {
      query[key] = placeholders[key];
    }

    return acc;
  }, url);

  if (Object.keys(query).length > 0) {
    return `${completeUrl}?${queryString.stringify(query)}`;
  }

  return completeUrl;
}


