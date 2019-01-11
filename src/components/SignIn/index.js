import React from 'react';
import { Link } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';

const SignIn = () => (
  <FormPage />
);

const FormPage = () => {
  return (
      <MDBContainer style={{marginTop: "3%"}}>
          <MDBRow>
              <MDBCol md="3"/>
              <MDBCol md="6">
                  <MDBCard>
                      <div className="header pt-3 special-color-dark">
                          <MDBRow className="d-flex justify-content-start">
                              <h5 className="white-text mt-3 mb-4 pb-1 mx-5">
                                  Sign In with Blockchain Scams
                              </h5>
                          </MDBRow>
                      </div>
                      <MDBCardBody className="mx-4 mt-4">
                          <form>
                              <div className="special-color-dark-text">
                                  <MDBInput
                                      label="Type your email"
                                      icon="envelope"
                                      group
                                      type="email"
                                      validate
                                      error="wrong"
                                      success="right"
                                  />
                                  <MDBInput
                                      label="Type your password"
                                      icon="lock"
                                      group
                                      type="password"
                                      validate
                                  />
                                  <p className="font-small blue-text d-flex justify-content-end pb-3">
                                      <a href="#!" className="dark-grey-text font-weight-bold ml-1">

                                          Forgot Password?
                                      </a>
                                  </p>
                              </div>
                              <div className="text-center mt-4">
                                  <button
                                      style={{backgroundColor: "#263238"}}
                                      className="btn"
                                      type="submit"
                                  >
                                      Sign In
                                  </button>
                              </div>
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
                                      Sign in with
                                      <MDBIcon icon="google-plus" style={{marginLeft: "5px"}} className="white-text"/>
                                  </MDBBtn>
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
};

export default SignIn;