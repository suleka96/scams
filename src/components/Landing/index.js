import React from 'react';
import { MDBJumbotron, MDBContainer,Col, Fa, Row } from "mdbreact";
import "./style.css";

const Landing = () => (
  <div>
    <SomeComponent />
  </div>
);

const SomeComponent = () => (
    <MDBContainer fluid>
        <MDBJumbotron fluid style={{backgroundColor: "#0099CA", marginLeft:"-15px", marginRight:"-15px",borderTopLeftRadius:"0",borderTopRightRadius:"0"}}>
            <MDBContainer style={{textAlign: "center", color: "white"}}>
                <h2 className="display-4">Blockchain Scams</h2>
                <p className="lead" style={{textTransform: "uppercase", fontSize: "14px"}}>This is the platform to check
                    a
                    address in various blockchains using lookup to see there have been scam alerts <br/>connected to it.
                    Or
                    report a scam if you have details on one</p>
                <Row>
                    <Col md="3"/>
                    <Col md="6">
                        <div className="input-group md-form form-sm form-1 pl-0">
                            <input
                                className="form-control my-0 py-1"
                                type="text"
                                placeholder="Enter blockchain address, keyword, name etc."
                                aria-label="Search"
                            />
                            <select className="browser-default" id="search-selector">
                              <option>Bitcoin</option>
                              <option value="1">Monero</option>
                              <option value="2">Ethereum</option>
                              <option value="3">Z cash</option>
                              <option value="3">Ripple</option>
                            </select>
                            <div className="input-group-prepend">
                                <span className="input-group-text special-color-dark lighten-3" id="basic-text1">
                                  <Fa className="text-white" icon="search"/>
                                </span>
                            </div>
                        </div>
                    </Col>
                    <Col md="3"/>
                </Row>
            </MDBContainer>
        </MDBJumbotron>
        <MDBContainer>
            <Row>
                <Col md="7">
                    <h3>What we offer here?</h3>
                    <hr/>

                    <ul>
                        <li>Track who's who in the world of Bitcoin with a powerful Bitcoin Block Explorer</li>
                        <li>Bitcoin Address Check to see if it has been reported as a scam</li>
                        <li>Check a bitcoin wallet balance</li>
                        <li>Find a bitcoin address owner</li>
                        <li>Bitcoin Wallet Transaction Alerts notify you by email when a bitcoin address has activity on the blockchain</li>
                        <li>View, monitor and search bitcoin ownership and wallet balance by name, bitcoin address, email address, url or keyword</li>
                        <li>Check a BTC address to find connected websites or owner profiles!</li>
                    </ul>
                </Col>
                <Col md="5">
                    <h3>Supported Blockchains</h3>
                    <hr/>
                    <img className="img-responsive" style={{width:"500px"}} src={'/images/cryptocurrency.jpg'} />
                </Col>
            </Row>
        </MDBContainer>
    </MDBContainer>

);

export default Landing;