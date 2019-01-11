import React from 'react';
import  { FirebaseContext } from '../Firebase';

const Landing = () => (
  <div>
    <SomeComponent />
  </div>
);

const SomeComponent = () => (
  <FirebaseContext.Consumer>
    {firebase => {
      return <h2>I've access to Firebase and render something.</h2>;
    }}
  </FirebaseContext.Consumer>
);

export default Landing;