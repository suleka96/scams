import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarNav, NavItem, NavLink, NavbarToggler, Collapse, FormInline, Dropdown, DropdownToggle, DropdownMenu,  DropdownItem, Container, Fa } from "mdbreact";

import * as ROUTES from '../../constants/routes';

const Navigation = () => (
  <NavbarPage />
);

class NavbarPage extends Component {
  state = {
    collapseID: ""
  };

  toggleCollapse = collapseID => () =>
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ""
    }));

  render() {
    return (
        <Navbar class="fixed-top" color="default-color" light expand="md">
            <Container>
                <NavbarBrand>
                    <strong className="dark-text">Blockchain Scams</strong>
                </NavbarBrand>
                <NavbarToggler onClick={this.toggleCollapse("navbarCollapse3")}/>
                <Collapse id="navbarCollapse3" isOpen={this.state.collapseID} navbar>
                    <NavbarNav left>
                        <NavItem active>
                            <NavLink to={ROUTES.LANDING}>Landing</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to={ROUTES.SIGN_IN}>Sign In</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to={ROUTES.HOME}>Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <Dropdown>
                                <DropdownToggle nav caret>
                                    <div className="d-none d-md-inline">Dropdown</div>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-default" right>
                                    <DropdownItem href="#!">Action</DropdownItem>
                                    <DropdownItem href="#!">Another Action</DropdownItem>
                                    <DropdownItem href="#!">Something else here</DropdownItem>
                                    <DropdownItem href="#!">Something else here</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </NavItem>
                    </NavbarNav>
                    <NavbarNav right>
                        <NavItem>
                            <Dropdown>
                                <DropdownToggle nav caret>
                                    <Fa icon="user" className="mr-1"/>Profile
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-default" right>
                                    <DropdownItem href="#!">My account</DropdownItem>
                                    <DropdownItem href="#!">Log out</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </NavItem>
                    </NavbarNav>
                </Collapse>
            </Container>
        </Navbar>
    );
  }
}

export default Navigation;