import React from 'react';
import { withAuthorization } from '../Session';

const TaggingPage = () => (
  <div>
    <h1>Tagging</h1>
  </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(TaggingPage);