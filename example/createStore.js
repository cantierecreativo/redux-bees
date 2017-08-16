import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

import {
  reducer as beesReducer,
  middleware as beesMiddleware,
} from 'redux-bees';

const reducer = combineReducers({
  bees: beesReducer,
});

export default function() {
  return createStore(
    reducer,
    compose(
      applyMiddleware(beesMiddleware())
      // window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
}

