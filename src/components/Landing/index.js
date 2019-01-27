import React, { Component } from 'react';
import { AuthUserContext } from '../Session';
import {  MDBBadge,MDBCardHeader,MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBAlert,MDBListGroup, MDBJumbotron, MDBContainer,Col, Fa, Row } from "mdbreact";
import "./style.css";
import {withFirebase} from "../Firebase";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class SomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            scams: [],
            tags: [],
            searchField:"",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({loading: true});
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
        this.props.firebase.tags().on('value', snapshot => {
            const tagObject = snapshot.val();

            if (tagObject !== null) {
                const tagList = Object.keys(tagObject).map(key => ({
                    ...tagObject[key],
                    tagid: key,
                }));

                this.setState({
                    tags: tagList.reverse().slice(0, 10),
                    loading: false,
                });
            }else{
                this.setState({
                    tags: [],
                    loading: false,
                });
            }

        });
    }

    componentWillUnmount() {
        this.props.firebase.reportScams().off();
        this.props.firebase.tags().off();
    }

    handleSubmit(event) {
        event.preventDefault();
        const {searchField} = this.state;
        const location = "/explorer/"+searchField;
        this.props.history.push(location);
    }

    render() {
        const {scams} = this.state;
        const {searchField} = this.state;
        const {tags, loading} = this.state;
        const isInvalid = searchField === '';
        return(
            <MDBContainer fluid>
                <MDBJumbotron fluid style={{
                    backgroundColor: "#0099CA",
                    marginLeft: "-15px",
                    marginRight: "-15px",
                    borderTopLeftRadius: "0",
                    borderTopRightRadius: "0"
                }}>
                    <MDBContainer style={{textAlign: "center", color: "white"}}>
                        <h2 className="display-4">Crypto Scams</h2>
                        <p className="lead" style={{textTransform: "uppercase", fontSize: "14px"}}>This is the platform
                            to check
                            an
                            address in various blockchains using explorer to see there have been scam alerts <br/>connected
                            to it.
                            Or
                            report a scam if you have details on one</p>
                        <Row>
                            <Col md="3"/>
                            <Col md="6">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="input-group md-form form-sm form-1 pl-0">

                                        <input
                                            className="form-control my-0 py-1"
                                            type="text"
                                            value={searchField}
                                            placeholder="Enter blockchain address, keyword, name etc."
                                            aria-label="Search"
                                            onChange={event => this.setState(byPropKey('searchField', event.target.value))}

                                        />
                                        <div className="input-group-prepend">
                                            <button type="submit"
                                                    className="input-group-text special-color-dark lighten-3"
                                                    id="basic-text1" disabled={isInvalid}>
                                                <Fa className="text-white" icon="search"/>
                                            </button>
                                        </div>

                                    </div>
                                </form>
                            </Col>
                            <Col md="3"/>
                        </Row>
                    </MDBContainer>
                </MDBJumbotron>
                <AuthUserContext.Consumer>
                    {authUser =>
                        authUser ? <NortificationPanel2/>:<NortificationPanel/>

                    }
                </AuthUserContext.Consumer>
                <MDBContainer>
                    <Row>
                        <Col md="12">
                            <h3>Latest Reported Scams</h3>
                            <hr/>

                            {loading && <div>Loading ...</div>}
                            <ScamList scams={scams}/>
                        </Col>
                    </Row>
                    <Row style={{marginTop:"50px"}}>
                        <Col md="12">
                            <h3>Latest Tagged Addresses</h3>
                            <hr/>

                            {loading && <div>Loading ...</div>}
                            <TagList tags={tags}/>
                        </Col>
                    </Row>
                </MDBContainer>
            </MDBContainer>
        )
    }
}

const ScamList = ({ scams }) => (
    <Row>
        <Col md="12">
            {scams.length > 0 ?
             scams.map(scam => (
                <MDBCard style={{marginTop: "1rem"}} key={scam.scamid} >
                    <MDBCardHeader color="blue-grey darken-3" className="mb-1 text-muted d-flex w-100 justify-content-between" >
                        <a className="address_hover" href={'/explorer/'+ scam.involvedAddress} style={{ color:"white"}}>ADDRESS: {scam.involvedAddress}</a>
                    <small style={{textAlign:"right", color:"#f5f5f5"}}><b>REPORTED DATE:</b> {scam.time}</small></MDBCardHeader>
                    <MDBCardBody>
                        <MDBCardTitle>
                            {scam.scamName}
                        </MDBCardTitle>
                        <MDBCardText>
                            <b>Description:</b> {scam.description}<br/>
                            <small className="text-muted"><b>Blockchain:</b> {scam.blockchain} / <b>Type:</b> {scam.scamType}</small>
                        </MDBCardText>
                    </MDBCardBody>
                </MDBCard>
            )):
                <h5>No any scam data</h5>
            }
        </Col>
    </Row>
);

const TagList = ({ tags }) => (
    <Row>
        <Col md="12">
            <MDBListGroup>
                {tags.length > 0 ?
                 tags.map(tag => (
                    <MDBCard style={{marginTop: "1rem"}} key={tag.tagid}>
                        <MDBCardHeader color=" mdb-color darken-3" className="mb-1 text-muted d-flex w-100 justify-content-between">
                            <a className="address_hover" href={'/explorer/'+ tag.involvedAddress} style={{ color:"white"}}>ADDRESS: {tag.involvedAddress}</a>
                            <small style={{textAlign: "right", color: "#f5f5f5"}}><b>REPORTED DATE:</b> {tag.time}</small>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <MDBCardTitle>
                                {tag.taggedNames.map((keys, i) => (
                                    <MDBBadge key={i} color="info" style={{marginRight:"5px"}}>{keys} </MDBBadge>
                                ))}
                            </MDBCardTitle>
                            <MDBCardText>
                                <b>Description:</b> {tag.description}<br/>
                                <small className="text-muted"><b>Blockchain:</b> {tag.blockchain}</small>
                            </MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                )) :
                    <h5>No any tagged data</h5>
                }
            </MDBListGroup>
        </Col>
    </Row>
);

const NortificationPanel = () => (
    <Row style={{
        marginTop: "-30px",
        marginBottom: "30px",
        marginLeft: "-15px !important",
        textAlign: "center",
        marginRight: "-15px !important"
    }}>
        <Col md="12">
            <MDBAlert color="info" dismiss style>
                <strong>Note: </strong> You just need to login to the system to report new scams or tag addresses!
            </MDBAlert>
        </Col>
    </Row>
);

const NortificationPanel2 = () => (
    <Row/>
);

const LandingDataPage = compose(
  withRouter,
  withFirebase,
)(SomeComponent);

export default LandingDataPage;