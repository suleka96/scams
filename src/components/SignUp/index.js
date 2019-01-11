import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

const SignUp = () => (
  <div>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {
 constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

 render() {
     const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

     const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

     return (
         <MDBContainer style={{marginTop: "3%"}}>
             <MDBRow>
                 <MDBCol md="3"/>
                 <MDBCol md="6">
                     <MDBCard>
                         <div className="header pt-3 special-color-dark">
                             <MDBRow className="d-flex justify-content-start">
                                 <h5 className="white-text mt-3 mb-4 pb-1 mx-5">
                                     Sign Up with Blockchain Scams
                                 </h5>
                             </MDBRow>
                         </div>
                         <MDBCardBody className="mx-4 mt-4">
                             <form onSubmit={this.onSubmit}>
                                 <div className="special-color-dark-text">
                                     <MDBInput
                                         label="Your name"
                                         name="username"
                                         value={username}
                                         onChange={this.onChange}
                                         icon="user"
                                         group
                                         type="text"
                                         validate
                                         error="wrong"
                                         success="right"
                                     />
                                     <MDBInput
                                         label="Your email"
                                         icon="envelope"
                                         name="email"
                                         value={email}
                                         onChange={this.onChange}
                                         group
                                         type="email"
                                         validate
                                         error="wrong"
                                         success="right"
                                     />
                                     <MDBInput
                                         label="Your password"
                                         icon="lock"
                                         name="passwordOne"
                                         value={passwordOne}
                                         onChange={this.onChange}
                                         group
                                         type="password"
                                         validate
                                         error="wrong"
                                         success="right"
                                     />
                                     <MDBInput
                                         label="Confirm your password"
                                         icon="exclamation-triangle"
                                         name="passwordTwo"
                                         value={passwordTwo}
                                         onChange={this.onChange}
                                         group
                                         type="password"
                                         validate
                                     />
                                 </div>
                                 <div className="text-center mt-4">
                                     <button
                                         disabled={isInvalid}
                                         style={{backgroundColor: "#263238"}}
                                         className="btn"
                                         type="submit"
                                     >
                                         Sign Up
                                     </button>
                                 </div>

                                 {error && <p style={{textAlign:"center", color:"#e53935 "}}>{error.message}</p>}

                                 <p className="font-small dark-grey-text text-right d-flex justify-content-center mb-3 pt-2">

                                     or
                                 </p>
                                 <div className="row my-3 d-flex justify-content-center">
                                     <MDBBtn
                                         type="button"
                                         color="red darken-3"
                                         rounded
                                         className="z-depth-1a"
                                     >
                                         Sign Up with
                                         <MDBIcon icon="google-plus" style={{marginLeft: "5px"}}
                                                  className="white-text"/>
                                     </MDBBtn>
                                 </div>
                             </form>
                             <MDBModalFooter className="mx-5 pt-3 mb-1">
                                 <p className="font-small grey-text d-flex justify-content-end">
                                     Already a scam member?
                                     <Link to="/signin" className="dark-grey-text font-weight-bold ml-1">
                                         Sign In Now
                                     </Link>
                                 </p>
                             </MDBModalFooter>
                         </MDBCardBody>
                     </MDBCard>
                 </MDBCol>
                 <MDBCol md="3"/>
             </MDBRow>
         </MDBContainer>
     );
 }
}

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUp;

export { SignUpForm};