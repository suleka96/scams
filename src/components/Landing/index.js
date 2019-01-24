import React, { Component } from 'react';
import { MDBListGroup, MDBListGroupItem, MDBJumbotron, MDBContainer,Col, Fa, Row } from "mdbreact";
import "./style.css";
import {withFirebase} from "../Firebase";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";

const Landing = () => (
  <div>
    <SomeComponent />
  </div>
);

class SomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            scams: [],
            tags: [],
        };
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

    render() {
        const {scams} = this.state;
        const {tags, loading} = this.state;
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
                            a
                            address in various blockchains using lookup to see there have been scam alerts <br/>connected
                            to it.
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

const TagList = ({ tags }) => (
    <Row>
        <Col md="12">
            <MDBListGroup>
                {tags.map(tag => (
                    <MDBListGroupItem href="#!" key={tag.tagid} style={{borderBottom:"3px solid #9D9C9D"}}>
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1 text-muted"><b>{tag.taggedNames}</b></h5>
                            <small className="text-muted">{tag.time}</small>
                        </div>
                        <hr />
                        <p className="mb-1 text-muted">{tag.description}</p>
                        <small className="text-muted"><b>Blockchain:</b> {tag.blockchain}</small>
                    </MDBListGroupItem>
                ))}
            </MDBListGroup>
        </Col>
        <Col md="1"/>
    </Row>
);

const LandingDataPage = compose(
  withRouter,
  withFirebase,
)(SomeComponent);

export default LandingDataPage;