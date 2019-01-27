import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBModalFooter } from 'mdbreact';
import { compose } from 'recompose';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import SignInGoogle from "../GoogleLogin";

const SignIn = () => (
  <SignInForm />
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.LANDING);
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
        const {email, password, error} = this.state;

        const isInvalid = password === '' || email === '';

        return (
            <MDBContainer style={{marginTop: "3%"}}>
                <MDBRow>
                    <MDBCol md="3"/>
                    <MDBCol md="6">
                        <MDBCard>
                            <div className="header pt-3 special-color-dark">
                                <MDBRow className="d-flex justify-content-start">
                                    <h5 className="white-text mt-3 mb-4 pb-1 mx-5">
                                        Sign In with Crypto Scams
                                    </h5>
                                </MDBRow>
                            </div>
                            <MDBCardBody className="mx-4 mt-4">
                                <form onSubmit={this.onSubmit}>
                                    <div className="special-color-dark-text">
                                        <MDBInput
                                            label="Type your email"
                                            icon="envelope"
                                            group
                                            name="email"
                                            value={email}
                                            onChange={this.onChange}
                                            type="email"
                                            validate
                                            error="wrong"
                                            success="right"
                                        />
                                        <MDBInput
                                            label="Type your password"
                                            icon="lock"
                                            name="password"
                                            value={password}
                                            onChange={this.onChange}
                                            group
                                            type="password"
                                            validate
                                        />
                                        <div className="font-small blue-text d-flex justify-content-end pb-3">
                                            <PasswordForgetLink />
                                        </div>
                                    </div>
                                    <div className="text-center mt-4">
                                        <button
                                            disabled={isInvalid}
                                            style={{backgroundColor: "#263238"}}
                                            className="btn"
                                            type="submit"
                                        >
                                            Sign In
                                        </button>
                                    </div>
                                    {error && <p style={{textAlign: "center", color: "#e53935 "}}>{error.message}</p>}

                                    <p className="font-small dark-grey-text text-right d-flex justify-content-center mb-3 pt-2">

                                        or
                                    </p>
                                    <div className="row my-3 d-flex justify-content-center">
                                        <SignInGoogle />
                                    </div>
                                </form>
                                <MDBModalFooter className="mx-5 pt-3 mb-1">
                                    <p className="font-small grey-text d-flex justify-content-end">
                                        Not a scam member?
                                        <Link to="/signup" className="dark-grey-text font-weight-bold ml-1">
                                            Sign Up Now
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

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignIn;
export { SignInForm };