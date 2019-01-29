import React, { Component } from 'react';
import {  MDBIcon,MDBBadge, Fa, MDBCardHeader,MDBCard, MDBCardBody, MDBCardTitle, MDBCardText,MDBListGroup, MDBJumbotron, MDBContainer,Col, Row } from "mdbreact";
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
            userData:null,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        let openVal = this.props.match.params.id;
        this.setState({ current_search:openVal});
    };

    componentDidMount() {
        this.setState({loading: true});
        this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                this.setState({userData: authUser.email})
            });

        this.props.firebase.reportScams().orderByChild("involvedAddress").equalTo(this.state.current_search).on('value', snapshot => {
            const scamObject = snapshot.val();

            if (scamObject !== null) {
                const scamList = Object.keys(scamObject).map(key => ({
                    ...scamObject[key],
                    scamid: key,
                    isUpVoted:false,
                    isDownVoted:false,
                }));

                for (let key in scamList) {
                    for (let key2 in scamList[key]){
                        if (key2 === 'upVotedBy'){
                            for (let key3 in scamList[key]["upVotedBy"]){
                                if (scamList[key]["upVotedBy"][key3] === this.state.userData){
                                    scamList[key]["isUpVoted"] = true;
                                    scamList[key]["isDownVoted"] = false;
                                    break;

                                }
                            }
                        }

                        if (key2 === 'downVotedBy'){
                            for (let key3 in scamList[key]["downVotedBy"]){
                                if (scamList[key]["downVotedBy"][key3] === this.state.userData){
                                     scamList[key]["isDownVoted"] = true;
                                     scamList[key]["isUpVoted"] = false;
                                     break;
                                }
                            }
                        }
                    }
                }
                this.setState({
                    scams: scamList,
                    loading: false,
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

    handleUpVote(Id, currentValue, index){
        let currentUser = this.state.userData;

        let updatedScams = this.state.scams;
        //disable up vote for user
        updatedScams[index].isUpVoted = true;

        //delete name from down vote list
        let up_reference = this.props.firebase.reportScams().child(Id).child('downVotedBy');
        if(updatedScams[index].isDownVoted === true){
            up_reference.once('child_added',function(data) {
                if(data.val() === currentUser){
                    up_reference.child(data.key).remove();
                }
            });
            updatedScams[index].voteCount = currentValue+2;
            this.props.firebase.reportScams().child(Id).update({'voteCount':currentValue+2});

            //remove from local storage
            let index_arr = updatedScams[index]["downVotedBy"].indexOf(currentUser);
            if (index_arr > -1) updatedScams[index]["downVotedBy"].splice(index_arr, 1);
        }else{
            updatedScams[index].voteCount = currentValue+1;
            this.props.firebase.reportScams().child(Id).update({'voteCount':currentValue+1});
        }

        //update state list of up vote users
        if(updatedScams[index]["upVotedBy"] !== undefined){
            updatedScams[index]["upVotedBy"].push(currentUser);
            //push user name for up vote list
            this.props.firebase.reportScams().child(Id).child('upVotedBy').update(updatedScams[index]["upVotedBy"]);
        }else{
            updatedScams[index]["upVotedBy"] = [currentUser];
            this.props.firebase.reportScams().child(Id).child('upVotedBy').set(updatedScams[index]["upVotedBy"]);
        }

        //enable down vote for user
        if(updatedScams[index].isDownVoted){
            updatedScams[index].isDownVoted = false;
        }
        this.setState({scams: updatedScams});

    }

    handleDownVote(Id, currentValue, index){
        let currentUser = this.state.userData;

        let updatedScams = this.state.scams;
        updatedScams[index].isDownVoted = true;

        let down_reference = this.props.firebase.reportScams().child(Id).child('upVotedBy');
        if(updatedScams[index].isUpVoted === true){
            down_reference.once('child_added',function(data) {
                if(data.val() === currentUser){
                    down_reference.child(data.key).remove();
                }
            });
            updatedScams[index].voteCount = currentValue-2;
            this.props.firebase.reportScams().child(Id).update({'voteCount':currentValue-2});

            //remove from local storage
            let index_arr = updatedScams[index]["upVotedBy"].indexOf(currentUser);
            if (index_arr > -1) updatedScams[index]["upVotedBy"].splice(index_arr, 1);
        }else{
            updatedScams[index].voteCount = currentValue-1;
            this.props.firebase.reportScams().child(Id).update({'voteCount':currentValue-1});
        }

        //update state list of down vote users
        if(updatedScams[index]["downVotedBy"] !== undefined){
            updatedScams[index]["downVotedBy"].push(currentUser);
            this.props.firebase.reportScams().child(Id).child('downVotedBy').update(updatedScams[index]["downVotedBy"]);
        }else{
            updatedScams[index]["downVotedBy"] = [currentUser];
            this.props.firebase.reportScams().child(Id).child('downVotedBy').set(updatedScams[index]["downVotedBy"]);
        }


        if(updatedScams[index].isUpVoted){
            updatedScams[index].isUpVoted = false;
        }
        this.setState({scams: updatedScams});
    }

    render() {
        const {scams} = this.state;
        const {tags, loading} = this.state;
        const {searchField} = this.state;
        const isInvalid = searchField === '';

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
                        {!loading && <h4 style={{marginLeft:"15px",color:"#006064", marginBottom:"20px"}}>Found {scams.length + tags.length} results for search address - #<b>{this.state.current_search}</b></h4>}
                    </Row>
                    <Row>
                        <Col md="12">
                            <h5>Reported Scams</h5>
                            <hr/>
                            {loading && <div>Loading ...</div>}
                            <ScamList scams={scams} firebase={this.props.firebase}  handleUpVote={this.handleUpVote.bind(this)} handleDownVote={this.handleDownVote.bind(this)} />
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

class ScamList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scams: [],
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({scams: newProps.scams});
    }

    render() {

        return (
            <Row>
                <Col md="12">
                    {this.state.scams.length > 0 ?
                        this.state.scams.map((scam,i) => (
                            <MDBCard style={{marginTop: "1rem"}} key={scam.scamid}>
                                <MDBCardHeader color="blue-grey darken-3"
                                               className="mb-1 text-muted d-flex w-100 justify-content-between">
                                    <a className="address_hover" href={'/explorer/' + scam.involvedAddress}
                                       style={{color: "white"}}>ADDRESS: {scam.involvedAddress}</a>
                                    <small style={{textAlign: "right", color: "#f5f5f5"}}><b>REPORTED
                                        DATE:</b> {scam.time}</small>
                                </MDBCardHeader>
                                <MDBCardBody>
                                    <Row>
                                        <Col md="5">
                                            <MDBCardTitle>
                                                {scam.scamName}
                                            </MDBCardTitle>
                                            <MDBCardText>
                                                <b>Description:</b> {scam.description}<br/>
                                                <b>Websites:</b> {scam.website}<br/>
                                                <b>Tags: </b>
                                                {scam.addressTags !== undefined ?
                                                    scam.addressTags.map((keys, i) => (
                                                        <MDBBadge key={i} color="dark" style={{marginRight: "5px"}}>{keys} </MDBBadge>
                                                    )) :
                                                    <b>-</b>
                                                }<br/>
                                                <small className="text-muted">
                                                    <b>Blockchain:</b> {scam.blockchain} / <b>Type:</b> {scam.scamType}
                                                </small>
                                            </MDBCardText>
                                        </Col>
                                        <Col md="3">
                                            <h6><u>Up Voted By:</u></h6>
                                            {scam.upVotedBy !== undefined ?
                                                scam.upVotedBy.map((keys, i) => (
                                                    <a href="#" key={i} style={{marginRight: "5px"}}>{keys} </a>
                                                )) :
                                                <b>-</b>
                                            }<br/>
                                        </Col>
                                        <Col md="3">
                                            <h6><u>Down Voted By:</u></h6>
                                            {scam.downVotedBy !== undefined ?
                                                scam.downVotedBy.map((keys, i) => (
                                                    <a href="#" key={i} style={{marginRight: "5px"}}>{keys} </a>
                                                )) :
                                                <b>-</b>
                                            }<br/>
                                        </Col>
                                        <Col md="1">
                                            <div style={{marginBottom: "-15px", marginTop: "-15px"}}>
                                                <button className="votes"  disabled={scam.isUpVoted} onClick={() => this.props.handleUpVote(scam.scamid,scam.voteCount,i)}><MDBIcon  icon="angle-up" style={{fontSize: "35px", fontWeight: "bold"}} /></button>
                                                <h2 style={{marginLeft:"0px", color: "#6c757d"}}>{scam.voteCount}</h2>
                                                <button className="votes" disabled={scam.isDownVoted}  onClick={() => this.props.handleDownVote(scam.scamid,scam.voteCount,i)}><MDBIcon  icon="angle-down" style={{fontSize: "35px", marginTop: "-10px", fontWeight: "bold"}} /></button>
                                            </div>
                                        </Col>
                                    </Row>
                                </MDBCardBody>
                            </MDBCard>
                        )) :
                        <h5>No any scam data</h5>
                    }
                </Col>
            </Row>
        );
    }
}


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