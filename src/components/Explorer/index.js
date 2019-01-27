import React, { Component } from 'react';
import {  MDBBadge, Fa, MDBCardHeader,MDBCard, MDBCardBody, MDBCardTitle, MDBCardText,MDBListGroup, MDBJumbotron, MDBContainer,Col, Row } from "mdbreact";
import "./style.css";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {withFirebase} from "../Firebase";

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class ExplorerInnerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current_search:"",
            loading:false,
            tags:[],
            scams:[],
            totalResults:0,
            searchField:"",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        let openVal = this.props.match.params.id;
        this.setState({ current_search:openVal});
    };

    componentDidMount() {
        this.setState({loading: true});

        this.props.firebase.reportScams().orderByChild("involvedAddress").equalTo(this.state.current_search).on('value', snapshot => {
            const scamObject = snapshot.val();

            if (scamObject !== null) {
                const scamList = Object.keys(scamObject).map(key => ({
                    ...scamObject[key],
                    scamid: key,
                }));

                this.setState({
                    scams: scamList,
                    loading: false,
                    totalResults : (this.state.totalResults+scamList.length)
                });

            }else{
                this.setState({
                    scams: [],
                    loading: false,
                });
            }

        });
        this.props.firebase.tags().orderByChild("involvedAddress").equalTo(this.state.current_search).on('value', snapshot => {
            const tagObject = snapshot.val();

            if (tagObject !== null) {
                const tagList = Object.keys(tagObject).map(key => ({
                    ...tagObject[key],
                    tagid: key,
                }));

                this.setState({
                    tags: tagList,
                    loading: false,
                    totalResults : (this.state.totalResults+tagList.length)
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
        window.location.reload();
    }

    render() {
        const {scams} = this.state;
        const {tags, loading} = this.state;
        const isInvalid = searchField === '';
        const {searchField} = this.state;

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
                        <h2 className="display-4">Explore Scams and Tags</h2>

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
                <MDBContainer>
                    <Row>
                        {loading && <h4 style={{marginLeft:"15px",color:"#006064", marginBottom:"20px"}}>Loading results for search address - #<b>{this.state.current_search}</b></h4>}
                        {!loading && <h4 style={{marginLeft:"15px",color:"#006064", marginBottom:"20px"}}>Found {this.state.totalResults} results for search address - #<b>{this.state.current_search}</b></h4>}
                    </Row>
                    <Row>
                        <Col md="12">
                            <h5>Reported Scams</h5>
                            <hr/>
                            {loading && <div>Loading ...</div>}
                            <ScamList scams={scams}/>
                        </Col>
                    </Row>

                    <Row style={{marginTop:"50px"}}>
                        <Col md="12">
                            <h5>Reported Tags</h5>
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
                            <b>Websites:</b> {scam.website}<br/>
                            <b>Tags: </b>
                            {scam.addressTags.map((keys, i) => (
                                <MDBBadge key={i} color="dark" style={{marginRight: "5px"}}>{keys} </MDBBadge>
                            ))}<br/>
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
                            <MDBCardHeader color=" mdb-color darken-3"
                                           className="mb-1 text-muted d-flex w-100 justify-content-between">
                                <a className="address_hover" href={'/explorer/' + tag.involvedAddress}
                                   style={{color: "white"}}>ADDRESS: {tag.involvedAddress}</a>
                                <small style={{textAlign: "right", color: "#f5f5f5"}}><b>REPORTED DATE:</b> {tag.time}
                                </small>
                            </MDBCardHeader>
                            <MDBCardBody>
                                <MDBCardTitle>
                                    {tag.taggedNames.map((keys, i) => (
                                        <MDBBadge key={i} color="info" style={{marginRight: "5px"}}>{keys} </MDBBadge>
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


const ExplorerPage = compose(
  withRouter,
  withFirebase,
)(ExplorerInnerPage);

export default ExplorerPage;