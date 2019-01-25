import * as ROLES from '../../constants/roles';
import { withAuthorization } from '../Session';
import React, { Component } from 'react';

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: {},
    };
  }

  render() {
    const { users, loading } = this.state;

    return (
      <div>
        <h1>Admin</h1>
        <p>
          The Admin Page is accessible by every signed in admin user.
        </p>

      </div>
    );
  }
}

const condition = authUser =>
  authUser && authUser.roles.includes(ROLES.ADMIN);

export default withAuthorization(condition)(AdminPage);