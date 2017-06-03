const defaultProcessor = (result) => result;

export default function buildMiddleware(promiseProcessor = defaultProcessor) {
  return () => next => (promise) => {
    if (promise.type === '@BEESNOOP') {
      return;
    }

    if (!promise.then) {
      return next(promise);
    }

    const meta = {
      api: true,
      name: promise.actionName,
      params: promise.params,
    };

    next({
      type: `api/${promise.actionName}/request`,
      meta: { ...meta, type: 'request' },
    });

    return promise
    .then(promiseProcessor)
    .then((result) => {
      next({
        type: `api/${promise.actionName}/response`,
        payload: result,
        meta: { ...meta, type: 'response' },
      });
      return Promise.resolve(result);
    })
    .catch((result) => {
      next({
        type: `api/${promise.actionName}/error`,
        payload: result,
        meta: { ...meta, type: 'error' },
      });
      return Promise.reject(result);
    });
  };
}
