import { NavLink } from 'react-router-dom';
import { useUserInfo } from '../contexts/userInfoContext';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

function Navigation() {
  const { user, logoutUser } = useUserInfo();

  return (
    <header style={{ marginTop: '79px' }}>
      <Navbar
        collapseOnSelect
        fixed="top"
        bg="warning"
        variant="light"
        expand="md"
        className="py-3 px-2 border-bottom border-1 border-dark">
        <Container fluid="md">
          <Navbar.Brand as={NavLink} to="/" className="me-auto fs-4 fw-bold">
            Personal Collection
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Stack
              gap="3"
              className="align-items-md-center flex-md-row-reverse">
              <Nav as="ul" className="align-items-md-center">
                {user ? (
                  <>
                    <NavDropdown
                      title="Create"
                      id="create"
                      as="ul"
                      active
                      className="fs-4 px-0">
                      <NavDropdown.Item as="li">
                        <Nav.Link
                          eventKey="collection"
                          as={NavLink}
                          to="/collections/create"
                          className="p-0 text-dark fs-5">
                          Collection
                        </Nav.Link>
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as="li">
                        <Nav.Link
                          eventKey="item"
                          as={NavLink}
                          to="/items/create"
                          className="p-0 text-dark fs-5">
                          Item
                        </Nav.Link>
                      </NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown
                      title="Profile"
                      id="profile"
                      as="ul"
                      active
                      className="fs-4 px-0 ps-md-3">
                      <NavDropdown.Item as="li">
                        <Nav.Link
                          eventKey="me"
                          as={NavLink}
                          to="/me"
                          className="p-0 text-dark fs-5">
                          Profile
                        </Nav.Link>
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item
                        as={Button}
                        variant="light"
                        eventKey="logout"
                        className="fs-5"
                        onClick={logoutUser}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : (
                  <>
                    <Nav.Item as="li" className="me-2">
                      <Nav.Link
                        eventKey="login"
                        as={NavLink}
                        to="/login"
                        className="fs-5 text-dark">
                        Sign In
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link
                        eventKey="signup"
                        as={NavLink}
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
