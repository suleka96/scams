import React from "react";
  import { Col, Container, Row, Footer } from "mdbreact";

  class FooterPagePro extends React.Component {
    render() {
    return (
  <Footer color="special-color-dark" className="font-small darken-3 pt-0">
      <Container>
        <Row>
          <Col md="12" className="py-5">
            <div className="mb-5 flex-center">
              <a href="#!" className="fb-ic">
                <i className="fa fa-facebook fa-lg white-text mr-md-5 mr-3 fa-2x">
                </i>
              </a>
              <a href="#!" className="gplus-ic">
                <i className="fa fa-google-plus fa-lg white-text mr-md-5 mr-3 fa-2x">
                </i>
              </a>
              <a href="#!" className="li-ic">
                <i className="fa fa-github fa-lg white-text mr-md-5 mr-3 fa-2x">
                </i>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="footer-copyright text-center py-3">
        <Container fluid>
          &copy; {new Date().getFullYear()} Copyright:{" "}
          <a href="https://www.scorelab.org"> scorelab.com </a>
        </Container>
      </div>
    </Footer>
    );
  }
}

export default FooterPagePro;