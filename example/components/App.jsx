import React from 'react';
import api from '../api';
import { query } from 'redux-bees';

@query('site', api.getSite, (call) => call({ include: 'item_types' }))

// It automatically handles "dependent data loading": Here, items depends
// on the first query, site. We don't get that until the first request has
// loaded.

@query('items', api.getModelRecords, function(call, props) {
  return call({ 'filter[type]': props.site && props.site.relationships.item_types.data[0].id });
})

export default class App extends React.Component {
  render() {
    const { items, status } = this.props;

    return (
      <div>
        {
          !status.items.hasStarted &&
            'Request not started...'
        }
        {
          status.items.isLoading &&
            'Loading...'
        }
        {
          status.items.hasFailed &&
            JSON.stringify(status.site.error)
        }
        {
          items &&
            JSON.stringify(items)
        }
      </div>
    );
  }
}


