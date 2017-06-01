import React from 'react';
import api from '../api';
import { query } from '../../index';

@query('sites', api.getSites, (call) => call({ foo: 'bar' }))

// It automatically handles "dependent data loading": Here, firstSite depends 
// on the first query, sites. We don't get that until the first request has
// loaded.

@query('firstSite', api.getSite, (call, props) => (
  call({ id: props.sites && props.sites.id })
))

export default class App extends React.Component {
  render() {
    const { sites, status } = this.props;

    return (
      <div>
        {
          !status.sites.hasStarted &&
            'Request not started...'
        }
        {
          status.sites.isLoading &&
            'Loading...'
        }
        {
          status.sites.hasFailed &&
            JSON.stringify(status.sites.error)
        }
        {
          sites &&
            JSON.stringify(sites)
        }
      </div>
    );
  }
}


