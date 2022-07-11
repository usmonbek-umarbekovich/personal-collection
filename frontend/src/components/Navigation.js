import { Link } from 'react-router-dom';
import { useUserInfo } from '../contexts/userInfoContext';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

function Navigation() {
  const { user, logoutUser } = useUserInfo();

  return (
    <header style={{ marginTop: '76px' }}>
      <Navbar
        collapseOnSelect
        fixed="top"
        bg="warning"
        variant="light"
        expand="lg"
        className="py-3 border-bottom border-1 border-dark">
        <Container>
          <Navbar.Brand as={Link} to="/" className="me-auto fs-4 fw-bold">
            Personal Collection
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Stack
              gap="3"
              className="align-items-lg-center flex-lg-row-reverse">
              <Nav as="ul" className="align-items-lg-center">
                {user ? (
                  <Nav.Item as="li">
                    <Nav.Link
                      eventKey="logout"
                      as={Button}
                      variant="danger"
                      className="text-light px-3"
                      onClick={logoutUser}>
                      Logout
                    </Nav.Link>
                  </Nav.Item>
                ) : (
                  <>
                    <Nav.Item as="li" className="me-2">
                      <Nav.Link
                        eventKey="login"
                        as={Link}
                        to="/login"
                        className="fs-5 text-dark">
                        Sign In
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link
                        eventKey="signup"
                        as={Link}
                        to="/register"
                        className="fs-5 text-dark">
                        Get Started
                      </Nav.Link>
                    </Nav.Item>
                  </>
                )}
              </Nav>
              <Form className="search-form">
                <Form.Control
                  type="search"
                  placeholder="Search for everything"
                  className="me-2"
                  aria-label="Search"
                />
              </Form>
            </Stack>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
export default Navigation;
