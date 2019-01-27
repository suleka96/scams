import React from 'react';
import { Container, MDBBtn, Navbar, NavbarBrand, NavbarNav, NavLink } from "mdbreact";
import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import * as ROUTES from "../../constants/routes";

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes('password');

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return (

          <AuthUserContext.Consumer>
              {authUser =>
                  needsEmailVerification(authUser) ? (
                      <Navbar color="special-color-dark" dark expand="md">
                          <Container>
                              <NavbarBrand>
                                  <strong className="white-text"><NavLink to={ROUTES.LANDING} className="white-text">Crypto
                                      Scams</NavLink></strong>
                              </NavbarBrand>
                              <NavbarNav right>
                                  <div className="mb-1 text-muted d-flex w-100 justify-content-between">
                                      <p className="white-text" style={{marginTop: "15px"}}>
                                          <b>Verify your e-mail:</b> Check you e-mails for a confirmation e-mail or
                                      </p>
                                      <MDBBtn color="info" onClick={this.onSendEmailVerification}>Send confirmation
                                          E-Mail</MDBBtn>
                                  </div>
                              </NavbarNav>
                          </Container>
                      </Navbar>
                  ) : (
                      <Component {...this.props} />
                  )
              }
          </AuthUserContext.Consumer>


      );
    }
  }

  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;