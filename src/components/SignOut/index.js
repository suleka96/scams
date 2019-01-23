import React from 'react';
import {DropdownItem} from "mdbreact";

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  <DropdownItem onClick={firebase.doSignOut}>Log out</DropdownItem>
);

export default withFirebase(SignOutButton);