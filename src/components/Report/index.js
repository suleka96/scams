import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { MDBListGroup, MDBListGroupItem,MDBJumbotron,Col, Row ,MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBIcon } from 'mdbreact';
import "./style.css";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {withFirebase} from "../Firebase";

const FORM_STATE = {
  reportedBy:'',
  scamName:'',
  blockchain: '',
  involvedAddress: '',
  scamType: '',
  website:'',
  description:'',
  time:'',
  error: null,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class ReportBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...FORM_STATE,
            loading: false,
            scams: [],
            userData:null,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({loading: true});

        //get user data and add to the state
        this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          this.setState({userData:authUser.email})
        });


        this.props.firebase.reportScams().on('value', snapshot => {
            const scamObject = snapshot.val();

            if (scamObject !== null) {
                const scamList = Object.keys(scamObject).map(key => ({
                    ...scamObject[key],
                    scamid: key,
                }));

                this.setState({
                    scams: scamList.reverse().slice(0, 10),
                    loading: false,
                });
            }else{
                this.setState({
                    scams: [],
                    loading: false,
                });
            }

        });
    }

    componentWillUnmount() {
        this.props.firebase.reportScams().off();
    }

    handleSubmit(event) {
        event.preventDefault();
        const { scamName, blockchain, involvedAddress, scamType,website,description } = this.state;
        let today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');


        this.props.firebase.reportScams().push({
                    reportedBy:this.state.userData,
                    scamName: scamName,
                    blockchain: blockchain,
                    involvedAddress: involvedAddress,
                    scamType: scamType,
                    website: website,
                    description: description,
                    time: today
                });

        alert("Submitted Successfully!");
        this.setState({...FORM_STATE});
    }

    render() {
        const {
            scamName,
            blockchain,
            involvedAddress,
            scamType,
            website,
            description,
        } = this.state;

        const {scams, loading} = this.state;

        const isInvalid =
            scamName === '' ||
            involvedAddress === '' || description === '' ||
            blockchain === '' || scamType === '';

        return (
            <MDBContainer fluid>
                <MDBJumbotron fluid style={{
                    backgroundColor: "#0099CA",
                    marginLeft: "-15px",
                    marginRight: "-15px",
                    borderTopLeftRadius: "0",
                    borderTopRightRadius: "0"
                }}>
                    <MDBContainer style={{textAlign: "center", color: "white"}}>
                        <h2 className="display-4">Report New Scams</h2>
                        <p className="lead" style={{textTransform: "uppercase", fontSize: "14px"}}>
                            Reporting Blockchain Abuse, Scams, Blackmail and Extortion Emails
                        </p>
                    </MDBContainer>
                </MDBJumbotron>
                <MDBContainer>
                    <Row>
                        <Col md="6">
                            <h3>Latest Reported Scams</h3>
                            <hr/>
                            {loading && <div>Loading ...</div>}

                            <ScamList scams={scams} />
                        </Col>
                        <Col md="6">
                            <h3>Report Scam</h3>
                            <hr/>
                            <MDBRow>
                                <MDBCol md="1"/>
                                <MDBCol md="11">
                                    <form onSubmit={this.handleSubmit}>
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
                                                            value={blockchain}
                                                            onChange={event => this.setState(byPropKey('blockchain', event.target.value))}>
                                                        <option>Choose Blockchain Type</option>
                                                        <option>Bitcoin</option>
                                                        <option>Monero</option>
                                                        <option>Ethereum</option>
                                                        <option>Ripple</option>
                                                        <option>Z-cash</option>
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
                                                value={involvedAddress}
                                                onChange={event => this.setState(byPropKey('involvedAddress', event.target.value))}
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
                                                value={description}
                                                onChange={event => this.setState(byPropKey('description', event.target.value))}
                                            />
                                        </div>
                                        <div className="text-center">
                                            <MDBBtn outline color="info" type="submit" disabled={isInvalid}>
                                                Report Now <MDBIcon icon="paper-plane-o" className="ml-1"/>
                                            </MDBBtn>
                                        </div>
                                    </form>
                                </MDBCol>
                            </MDBRow>
                        </Col>
                    </Row>
                </MDBContainer>
            </MDBContainer>
        )
    }
}

const ScamList = ({ scams }) => (
    <Row>
        <Col md="11">
            <MDBListGroup>
                {scams.map(scam => (
                    <MDBListGroupItem href="#!" key={scam.scamid} style={{borderBottom:"3px solid #9D9C9D"}}>
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1 text-muted"><b>{scam.scamName}</b></h5>
                            <small className="text-muted">{scam.time}</small>
                        </div>
                        <hr />
                        <p className="mb-1 text-muted">{scam.description}</p>
                        <small className="text-muted"><b>Blockchain:</b> {scam.blockchain} / <b>Type:</b> {scam.scamType}</small>
                    </MDBListGroupItem>
                ))}
            </MDBListGroup>
        </Col>
        <Col md="1"/>
    </Row>
);


const condition = authUser => !!authUser;
const ReportPage2 = compose(
  withRouter,
  withFirebase,
)(ReportBase);

export default withAuthorization(condition)(ReportPage2);