import React from 'react';
import api from '../api';
import { query } from '../../index';

@query('sites', api.getSites)

export default class App extends React.Component {
  componentDidMount() {
    const { sites } = this.props;
    sites.fetch();
  }

  render() {
    const { sites } = this.props;

    return (
      <div>
        {
          !sites.hasStarted &&
            'Request not started...'
        }
        {
          sites.isLoading &&
            'Loading...'
        }
        {
          sites.hasFailed &&
            JSON.stringify(sites.error)
        }
        {
          sites.result &&
            JSON.stringify(sites.result)
        }
      </div>
    );
  }
}


