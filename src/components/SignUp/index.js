import React from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';
import { Link } from 'react-router-dom';

const SignUp = () => (
  <div>
    <SignUpFormPage />
  </div>
);

const SignUpFormPage = () => {
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
                          <form>
                              <div className="special-color-dark-text">
                                  <MDBInput
                                      label="Your name"
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
                                      group
                                      type="email"
                                      validate
                                      error="wrong"
                                      success="right"
                                  />
                                  <MDBInput
                                      label="Your password"
                                      icon="lock"
                                      group
                                      type="password"
                                      validate
                                      error="wrong"
                                      success="right"
                                  />
                                  <MDBInput
                                      label="Confirm your password"
                                      icon="exclamation-triangle"
                                      group
                                      type="password"
                                      validate
                                  />
                              </div>
                              <div className="text-center mt-4">
                                  <button
                                      style={{backgroundColor: "#263238"}}
                                      className="btn"
                                      type="submit"
                                  >
                                      Sign Up
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
                                      Sign Up with
                                      <MDBIcon icon="google-plus" style={{marginLeft: "5px"}} className="white-text"/>
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
};

export default SignUp;