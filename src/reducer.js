import entities from './reducers/entities';
import requests from './reducers/requests';

export default function reducer(state = {}, action) {
  return {
    requests: requests(state.requests, action),
    entities: entities(state.entities, action),
  }
};
