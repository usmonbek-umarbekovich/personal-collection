import { NavLink } from 'react-router-dom';
import { useUserInfo } from '../contexts/userInfoContext';
import { getFullName } from '../helpers';
import CollapseContent from './CollapseContent';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { FaUser, FaPlus } from 'react-icons/fa';

function Navigation() {
  const { user, logoutUser } = useUserInfo();

  return (
    <header style={{ marginTop: 'var(--nav-height)' }}>
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
              <Nav as="ul" className="d-flex align-items-md-center">
                {user ? (
                  <Stack direction="horizontal" gap="3">
                    <CollapseContent
                      controlId="create"
                      Icon={FaPlus}
                      btnProps={{ title: 'Create' }}>
                      <ListGroup.Item action className="text-nowrap p-0">
                        <NavLink
                          to="collections/create"
                          className="d-block text-reset fs-5 px-4 py-2">
                          Create Collection
                        </NavLink>
                      </ListGroup.Item>
                      <ListGroup.Item action className="text-nowrap p-0">
                        <NavLink
                          to="items/create"
                          className="d-block text-reset fs-5 px-4 py-2">
                          Add Item
                        </NavLink>
                      </ListGroup.Item>
                    </CollapseContent>

                    <CollapseContent
                      controlId="avatar"
                      Icon={FaUser}
                      btnProps={{
                        variant: 'secondary',
                        title: 'Profile',
                      }}>
                      <ListGroup.Item action className="text-nowrap p-0">
                        <NavLink
                          to={`users/${user._id}`}
                          className="d-block text-reset fs-5 px-4 py-2">
                          {getFullName(user.name)}
                        </NavLink>
                      </ListGroup.Item>
                      <ListGroup.Item
                        action
                        onClick={logoutUser}
                        className="fs-5 px-4 text-nowrap">
                        Logout
                      </ListGroup.Item>
                    </CollapseContent>
                  </Stack>
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
