import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavItem, NavLink, NavbarToggler, Collapse, FormInline, Dropdown, DropdownToggle, DropdownMenu,  DropdownItem, Container, Fa } from "mdbreact";
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const Navigation = () => (
  <div>
      <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

class NavigationAuth extends Component {
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
                    <strong className="white-text"><NavLink to={ROUTES.LANDING} className="white-text">Blockchain Scams</NavLink></strong>
                </NavbarBrand>
                <NavbarToggler onClick={this.toggleCollapse("navbarCollapse3")}/>
                <Collapse id="navbarCollapse3" isOpen={this.state.collapseID} navbar>
                    <NavbarNav left >
                        <NavItem>
                            <NavLink to={ROUTES.LOOKUP}>Address Lookup</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to={ROUTES.REPORT}>Report Scam</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to={ROUTES.TAG}>Tag An Address</NavLink>
                        </NavItem>
                    </NavbarNav>
                    <NavbarNav right>
                        <AuthUserContext.Consumer>
                            {authUser => (
                                <NavItem>
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
                    <strong className="white-text"><NavLink to={ROUTES.LANDING} className="white-text">Blockchain Scams</NavLink></strong>
                </NavbarBrand>
                <NavbarToggler onClick={this.toggleCollapse("navbarCollapse3")}/>
                <Collapse id="navbarCollapse3" isOpen={this.state.collapseID} navbar>
                    <NavbarNav left >
                        <NavItem>
                            <NavLink to={ROUTES.LOOKUP}>Address Lookup</NavLink>
                        </NavItem>
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

export default Navigation;