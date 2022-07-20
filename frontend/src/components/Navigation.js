import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUserInfo } from '../contexts/userInfoContext';
import { getFullName } from '../helpers';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import ListGroup from 'react-bootstrap/ListGroup';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Image from 'react-bootstrap/Image';
import { FaUser, FaPlus } from 'react-icons/fa';

function Navigation() {
  const [open, setOpen] = useState({ avatar: false, create: false });
  const { user, logoutUser } = useUserInfo();
  const location = useLocation();

  useEffect(() => {
    setOpen({ avatar: false, create: false });
  }, [location]);

  const handleBlur = (e, element) => {
    if (!e.relatedTarget || !e.relatedTarget.closest(`#${element}`)) {
      return setOpen({
        ...open,
        [element]: false,
      });
    }
  };

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
              <Nav as="ul" className="d-flex align-items-md-center">
                {user ? (
                  <Stack direction="horizontal" gap="3">
                    <div className="position-relative">
                      <Button
                        onClick={() =>
                          setOpen({
                            create: !open.create,
                            avatar: false,
                          })
                        }
                        onBlur={e => handleBlur(e, 'create')}
                        aria-controls="create"
                        title="Create"
                        aria-expanded={open.create}
                        style={{ width: '2.75rem', height: '2.75rem' }}
                        className="d-flex rounded-circle p-1">
                        <FaPlus className="m-auto fs-4" />
                      </Button>
                      <Collapse in={open.create} timeout={200}>
                        <ListGroup
                          id="create"
                          variant="light"
                          className="position-absolute top-100 mt-2">
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
                        </ListGroup>
                      </Collapse>
                    </div>

                    <div className="position-relative">
                      <Button
                        variant="secondary"
                        onClick={() =>
                          setOpen({
                            avatar: !open.avatar,
                            create: false,
                          })
                        }
                        onBlur={e => handleBlur(e, 'avatar')}
                        title="Profile"
                        aria-controls="avatar"
                        aria-expanded={open.avatar}
                        style={{ width: '2.75rem', height: '2.75rem' }}
                        className="d-flex rounded-circle p-1">
                        {user?.avatar ? (
                          <Image
                            fluid
                            src={user.avatar}
                            alt={getFullName(user.name)}
                          />
                        ) : (
                          <FaUser className="m-auto fs-4" />
                        )}
                      </Button>
                      <Collapse in={open.avatar} timeout={200}>
                        <ListGroup
                          id="avatar"
                          variant="light"
                          className="position-absolute top-100 mt-2">
                          <ListGroup.Item action className="p-0">
                            <NavLink
                              to={`users/${user._id}`}
                              className="d-block text-reset fs-5 px-5 py-2">
                              Profile
                            </NavLink>
                          </ListGroup.Item>
                          <ListGroup.Item
                            action
                            onClick={logoutUser}
                            className="fs-5 px-5">
                            Logout
                          </ListGroup.Item>
                        </ListGroup>
                      </Collapse>
                    </div>
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
