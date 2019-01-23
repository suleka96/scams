import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { MDBListGroup, MDBListGroupItem,MDBJumbotron,Col, Row ,MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBIcon } from 'mdbreact';
import "./style.css";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {withFirebase} from "../Firebase";

const FORM_STATE = {
  reportedBy:'',
  taggedNames:'',
  blockchain: '',
  involvedAddress: '',
  description:'',
  time:'',
  error: null,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});


class TaggingBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...FORM_STATE,
            loading: false,
            tags: [],
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
        this.props.firebase.tags().off();
    }

    handleSubmit(event) {
        event.preventDefault();
        const { taggedNames, blockchain, involvedAddress,description } = this.state;
        let today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');


        this.props.firebase.tags().push({
                    taggedBy:this.state.userData,
                    taggedNames: taggedNames,
                    blockchain: blockchain,
                    involvedAddress: involvedAddress,
                    description: description,
                    time: today
                });

        alert("Submitted Successfully!");
        this.setState({...FORM_STATE});
    }

    render() {
        const {
            taggedNames,
            blockchain,
            involvedAddress,
            description,
        } = this.state;

        const {tags, loading} = this.state;

        const isInvalid =
            tags === '' ||
            involvedAddress === '' || description === '' ||
            blockchain === '' ;

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
                        <h2 className="display-4">Tag Addresses</h2>
                        <p className="lead" style={{textTransform: "uppercase", fontSize: "14px"}}>
                            Tagging addresses makes the community safer by helping users identify legitimate  <br/>addresses before sending
                        </p>
                    </MDBContainer>
                </MDBJumbotron>
                <MDBContainer>
                    <Row>
                        <Col md="6">
                            <h3>Latest Tags</h3>
                            <hr/>
                            {loading && <div>Loading ...</div>}

                            <TagList tags={tags} />
                        </Col>
                        <Col md="6">
                            <h3>Add New Tags</h3>
                            <hr/>
                            <MDBRow>
                                <MDBCol md="1"/>
                                <MDBCol md="11">
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="grey-text">
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
                                                value={description}
                                                onChange={event => this.setState(byPropKey('description', event.target.value))}
                                            />
                                        </div>
                                        <div className="text-center">
                                            <MDBBtn outline color="info" type="submit" disabled={isInvalid}>
                                                Tag Now <MDBIcon icon="paper-plane-o" className="ml-1"/>
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

const TagList = ({ tags }) => (
    <Row>
        <Col md="11">
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


const condition = authUser => !!authUser;
const TagPage2 = compose(
  withRouter,
  withFirebase,
)(TaggingBase);

export default withAuthorization(condition)(TagPage2);