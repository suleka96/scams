import React, { Component } from 'react';
import {  MDBRow, MDBCol,Col, Row, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBtn, Navbar, NavbarBrand, NavbarNav, NavItem, NavLink, NavbarToggler, Collapse, FormInline, Dropdown, DropdownToggle, DropdownMenu,  DropdownItem, Container, Fa } from "mdbreact";
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext, withAuthorization } from '../Session';
import "./style.css";
import {withRouter} from "react-router-dom";
import {withFirebase} from "../Firebase";
import {compose} from "recompose";

const FORM_STATE = {
  reportedBy:'',
  scamName:'',
  blockchainScam: '',
  involvedScamAddress: '',
  scamType: '',
  website:'',
  scamDescription:'',
  time:'',
  error: null,
};

const FORM_STATE_TAG = {
  reportedBy:'',
  taggedNames:'',
  blockchainTag: '',
  involvedTagAddress: '',
  tagDescription:'',
  time:'',
  error: null,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const Navigation = () => (
  <div>
      <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth2 /> : <NavigationNonAuth />

      }
    </AuthUserContext.Consumer>
  </div>
);

class NavigationAuth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...FORM_STATE,
            ...FORM_STATE_TAG,
            userData:null,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitTag = this.handleSubmitTag.bind(this);
    }

    componentDidMount() {
        //get user data and add to the state
        this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                this.setState({userData: authUser.email})
            });

    }

    state = {
        collapseID: ""
    };

    toggleCollapse = collapseID => () =>
        this.setState(prevState => ({
            collapseID: prevState.collapseID !== collapseID ? collapseID : ""
        }));

    scamToggle = () => {
        this.setState({
            scamModal: !this.state.scamModal
        });
    };

    tagToggle = () => {
        this.setState({
            tagModal: !this.state.tagModal
        });
    };

    handleSubmit(event) {
        event.preventDefault();
        const { scamName, blockchainScam, involvedScamAddress, scamType,website,scamDescription } = this.state;
        let today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');


        this.props.firebase.reportScams().push({
                    reportedBy:this.state.userData,
                    scamName: scamName,
                    blockchain: blockchainScam,
                    involvedAddress: involvedScamAddress,
                    scamType: scamType,
                    website: website,
                    description: scamDescription,
                    time: today
                });

        alert("Submitted Successfully!");
        this.setState({...FORM_STATE});
        this.setState({
            scamModal: !this.state.scamModal
        });
    }

    handleSubmitTag(event) {
        event.preventDefault();
        const { taggedNames, blockchainTag, involvedTagAddress,tagDescription } = this.state;
        let today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');


        this.props.firebase.tags().push({
                    taggedBy:this.state.userData,
                    taggedNames: taggedNames,
                    blockchain: blockchainTag,
                    involvedAddress: involvedTagAddress,
                    description: tagDescription,
                    time: today
                });

        alert("Submitted Successfully!");
        this.setState({...FORM_STATE_TAG});
        this.setState({
            tagModal: !this.state.tagModal
        });
    }

  render() {
      const {
          scamName,
          blockchainScam,
          involvedScamAddress,
          scamType,
          website,
          scamDescription,
      } = this.state;

      const {
            taggedNames,
            blockchainTag,
            involvedTagAddress,
            tagDescription,
        } = this.state;

      const isInvalidTag =
            taggedNames === '' ||
            involvedTagAddress === '' || tagDescription === '' ||
            blockchainTag === '' ;

      const isInvalid =
          scamName === '' ||
          involvedScamAddress === '' || scamDescription === '' ||
          blockchainScam === '' || scamType === '';

      return (
          <div>
              <Navbar color="special-color-dark" dark expand="md">
                  <Container>
                      <NavbarBrand>
                          <strong className="white-text"><NavLink to={ROUTES.LANDING} className="white-text">Crypto
                              Scams</NavLink></strong>
                      </NavbarBrand>
                      <NavbarToggler onClick={this.toggleCollapse("navbarCollapse3")}/>
                      <Collapse id="navbarCollapse3" isOpen={this.state.collapseID} navbar>
                          <NavbarNav left>
                              {/*<NavItem>*/}
                              {/*<NavLink to={ROUTES.REPORT}>Report Scam</NavLink>*/}
                              {/*</NavItem>*/}
                              {/*<NavItem>*/}
                              {/*<NavLink to={ROUTES.TAG}>Tag An Address</NavLink>*/}
                              {/*</NavItem>*/}
                          </NavbarNav>
                          <NavbarNav right>
                              <NavItem>
                                  <MDBBtn color="dark-green" onClick={this.scamToggle}><MDBIcon icon="plus"
                                                                                                className="mr-1"/>Report
                                      Scams</MDBBtn>
                              </NavItem>
                              <NavItem>
                                  <MDBBtn color="amber" onClick={this.tagToggle}><MDBIcon icon="tags" className="mr-1"/>Add
                                      Tags</MDBBtn>
                              </NavItem>
                              <AuthUserContext.Consumer>
                                  {authUser => (
                                      <NavItem style={{marginTop: "7px"}}>
                                          <Dropdown>
                                              <DropdownToggle nav caret>
                                                  <Fa icon="user" className="mr-1"/>
                                                  {authUser.email.split('@')[0]}
                                              </DropdownToggle>
                                              <DropdownMenu className="dropdown-default" right>
                                                  <DropdownItem><NavLink to={ROUTES.ACCOUNT} style={{
                                                      color: "#212529",
                                                      textAlign: "left",
                                                      marginLeft: "-7px"
                                                  }}><b>My Account</b></NavLink></DropdownItem>
                                                  <SignOutButton/>
                                              </DropdownMenu>
                                          </Dropdown>
                                      </NavItem>
                                  )}
                              </AuthUserContext.Consumer>
                          </NavbarNav>
                      </Collapse>
                  </Container>
              </Navbar>

              {/*Add new scam modal*/}
              <MDBModal isOpen={this.state.scamModal} toggle={this.scamToggle}>
                  <MDBModalHeader toggle={this.scamToggle}>Report New Scam</MDBModalHeader>
                  <form onSubmit={this.handleSubmit}>
                      <MDBModalBody>
                          <MDBRow>
                              <MDBCol md="12">
                                  <div className="grey-text">
                                      <MDBInput
                                          label="Name of Scam"
                                          icon="database"
                                          group
                                          type="text"
                                          validate
                                          error="wrong"
                                          success="right"
                                          value={scamName}
                                          onChange={event => this.setState(byPropKey('scamName', event.target.value))}
                                      />
                                      <Row className="form-group margin-bot">
                                          <Col md="1">
                                              <MDBIcon icon="btc" style={{fontSize: "30px"}}/>
                                          </Col>
                                          <Col md="11">
                                              <select className="browser-default custom-select"
                                                      style={{marginLeft: "-6px"}}
                                                      value={blockchainScam}
                                                      onChange={event => this.setState(byPropKey('blockchainScam', event.target.value))}>
                                                  <option>Choose Blockchain Type</option>
                                                  <option>Bitcoin</option>
                                                  {/*<option>Monero</option>*/}
                                                  {/*<option>Ethereum</option>*/}
                                                  {/*<option>Ripple</option>*/}
                                                  {/*<option>Z-cash</option>*/}
                                              </select>
                                          </Col>
                                      </Row>
                                      <MDBInput
                                          label="Involved Address"
                                          icon="address-book"
                                          group
                                          type="text"
                                          validate
                                          error="wrong"
                                          success="right"
                                          value={involvedScamAddress}
                                          onChange={event => this.setState(byPropKey('involvedScamAddress', event.target.value))}
                                      />
                                      <Row className="form-group margin-bot">
                                          <Col md="1">
                                              <MDBIcon icon="shield" style={{fontSize: "30px"}}/>
                                          </Col>
                                          <Col md="11">
                                              <select className="browser-default custom-select"
                                                      style={{marginLeft: "-6px"}}
                                                      value={scamType}
                                                      onChange={event => this.setState(byPropKey('scamType', event.target.value))}>
                                                  <option>Scam Type</option>
                                                  <option value="Sextortion Email">Sextortion Email</option>
                                                  <option value="Sextortion w/Password Email">Sextortion
                                                      w/Password Email
                                                  </option>
                                                  <option value="Sextortion w/Phone # Email">Sextortion w/Phone #
                                                      Email
                                                  </option>
                                                  <option value="Multiplier">Multiplier</option>
                                                  <option value="Cloud Mining">Cloud Mining</option>
                                                  <option value="Online Transaction Fraud">Online Transaction
                                                      Fraud
                                                  </option>
                                                  <option value="Ransomware">Ransomware</option>
                                                  <option value="Account Hacked">Account Hacked</option>
                                                  <option value="Clipboard Virus">Clipboard Virus</option>
                                                  <option value="Snail Mail Cheater Blackmail">Snail Mail Cheater
                                                      Blackmail
                                                  </option>
                                                  <option value="Fake Celebrity">Fake Celebrity</option>
                                                  <option value="Exchange Collapse">Exchange Collapse</option>
                                                  <option value="eBay">eBay</option>
                                                  <option value="Escrow Service<">Escrow Service</option>
                                                  <option value="FBI Impersonator">FBI Impersonator</option>
                                                  <option value="Genesis Bordeos">Genesis Bordeos</option>
                                                  <option value="Mining Service">Mining Service</option>
                                                  <option value="Ashley Madison Extortion">Ashley Madison
                                                      Extortion
                                                  </option>
                                                  <option value="Austin Cain">Austin Cain</option>
                                                  <option value="Mixing Service">Mixing Service</option>
                                                  <option value="Property Rental">Property Rental</option>
                                                  <option value="Other">Other</option>
                                              </select>
                                          </Col>
                                      </Row>
                                      <MDBInput
                                          label="Website (optional)"
                                          icon="globe"
                                          group
                                          type="text"
                                          validate
                                          error="wrong"
                                          success="right"
                                          value={website}
                                          onChange={event => this.setState(byPropKey('website', event.target.value))}
                                      />
                                      <MDBInput
                                          type="textarea"
                                          rows="2"
                                          label="Other Details"
                                          icon="pencil"
                                          value={scamDescription}
                                          onChange={event => this.setState(byPropKey('scamDescription', event.target.value))}
                                      />
                                  </div>
                              </MDBCol>
                          </MDBRow>
                      </MDBModalBody>
                      <MDBModalFooter>
                          <MDBBtn color="primary" onClick={this.scamToggle}>Close</MDBBtn>
                          <MDBBtn color="dark-green" type="submit" disabled={isInvalid}>
                              Report Now <MDBIcon icon="paper-plane-o" className="ml-1"/>
                          </MDBBtn>
                      </MDBModalFooter>
                  </form>
              </MDBModal>

              {/*Add new Tag*/}
              <MDBModal isOpen={this.state.tagModal} toggle={this.tagToggle}>
                  <MDBModalHeader toggle={this.tagToggle}>Add Tags</MDBModalHeader>
                  <form onSubmit={this.handleSubmitTag}>
                      <MDBModalBody>
                          <div className="grey-text">
                              <MDBInput
                                  label="Involved Address"
                                  icon="address-book"
                                  group
                                  type="text"
                                  validate
                                  error="wrong"
                                  success="right"
                                  value={involvedTagAddress}
                                  onChange={event => this.setState(byPropKey('involvedTagAddress', event.target.value))}
                              />
                              <Row className="form-group margin-bot">
                                  <Col md="1">
                                      <MDBIcon icon="btc" style={{fontSize: "30px"}}/>
                                  </Col>
                                  <Col md="11">
                                      <select className="browser-default custom-select"
                                              style={{marginLeft: "-6px"}}
                                              value={blockchainTag}
                                              onChange={event => this.setState(byPropKey('blockchainTag', event.target.value))}>
                                          <option>Choose Blockchain Type</option>
                                          <option>Bitcoin</option>
                                          {/*<option>Monero</option>*/}
                                          {/*<option>Ethereum</option>*/}
                                          {/*<option>Ripple</option>*/}
                                          {/*<option>Z-cash</option>*/}
                                      </select>
                                  </Col>
                              </Row>
                              <MDBInput
                                  label="Enter Tags with comma seperated"
                                  icon="tags"
                                  group
                                  type="text"
                                  validate
                                  error="wrong"
                                  success="right"
                                  value={taggedNames}
                                  onChange={event => this.setState(byPropKey('taggedNames', event.target.value))}
                              />
                              <MDBInput
                                  type="textarea"
                                  rows="2"
                                  label="Other Details"
                                  icon="pencil"
                                  value={tagDescription}
                                  onChange={event => this.setState(byPropKey('tagDescription', event.target.value))}
                              />
                          </div>
                      </MDBModalBody>
                      <MDBModalFooter>
                          <MDBBtn color="primary" onClick={this.tagToggle}>Close</MDBBtn>
                          <MDBBtn color="amber" type="submit" disabled={isInvalidTag}>
                              Tag Now <MDBIcon icon="paper-plane-o" className="ml-1"/>
                          </MDBBtn>
                      </MDBModalFooter>
                  </form>
              </MDBModal>
          </div>
    );
  }
}

class NavigationNonAuth extends Component {
  state = {
    collapseID: ""
  };

  toggleCollapse = collapseID => () =>
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ""
    }));

  render() {
    return (
        <Navbar color="special-color-dark" dark expand="md">
            <Container>
                <NavbarBrand>
                    <strong className="white-text"><NavLink to={ROUTES.LANDING} className="white-text">Crypto Scams</NavLink></strong>
                </NavbarBrand>
                <NavbarToggler onClick={this.toggleCollapse("navbarCollapse3")}/>
                <Collapse id="navbarCollapse3" isOpen={this.state.collapseID} navbar>
                    <NavbarNav left >
                    </NavbarNav>
                    <NavbarNav right>
                        <NavItem>
                            <NavLink to={ROUTES.SIGN_IN}>Sign In</NavLink>
                        </NavItem>
                    </NavbarNav>
                </Collapse>
            </Container>
        </Navbar>
    );
  }
}

const NavigationAuth2 = compose(
  withRouter,
  withFirebase,
)(NavigationAuth);

export default Navigation;