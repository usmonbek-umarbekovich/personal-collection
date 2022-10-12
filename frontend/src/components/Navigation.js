import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUserInfo } from '../contexts/userInfoContext';
import { getFullName } from '../helpers';
import userService from '../services/userService';
import classNames from 'classnames';
import SearchForm from './SearchForm';
import CollapseContent from './CollapseContent';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';
import { FaUser, FaPlus } from 'react-icons/fa';

function Navigation() {
  const [expanded, setExpanded] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const { user, logoutUser } = useUserInfo();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;
    userService.getSingleUser(user._id).then(({ avatar }) => setAvatar(avatar));
  }, [user]);

  const handleNavbarSelect = eventKey => {
    const excludedKeys = ['all', 'item', 'collection', 'user'];
    if (!excludedKeys.includes(eventKey)) setExpanded(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setExpanded(false);
  };

  return (
    <header
      className={classNames({
        'bg-warning': !user && location.pathname === '/',
      })}>
      <Navbar
        fixed="top"
        bg="warning"
        variant="light"
        expand="lg"
        expanded={expanded}
        onSelect={handleNavbarSelect}
        className="py-3 px-2 border-bottom border-1 border-dark">
        <Container fluid="md">
          <Navbar.Brand
            as={NavLink}
            to="/"
            className="me-auto pe-4 fs-4 fw-bold">
            Personal Collection
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="navbar"
            onClick={() => setExpanded(prev => !prev)}
          />
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
                      listProps={{ className: 'top-100 mt-2' }}
                      btnProps={{ title: 'Create', className: 'p-1' }}>
                      <ListGroup.Item
                        action
                        active={location.pathname === '/collections/create'}
                        className="text-nowrap p-0">
                        <Nav.Link
                          as={NavLink}
                          eventKey="create-collection"
                          to="collections/create"
                          className="d-block text-reset fs-5 px-4 py-2">
                          Create Collection
                        </Nav.Link>
                      </ListGroup.Item>
                      <ListGroup.Item
                        action
                        active={location.pathname === '/items/create'}
                        className="text-nowrap p-0">
                        <Nav.Link
                          as={NavLink}
                          eventKey="create-item"
                          to="items/create"
                          className="d-block text-reset fs-5 px-4 py-2">
                          Add Item
                        </Nav.Link>
                      </ListGroup.Item>
                    </CollapseContent>

                    <CollapseContent
                      controlId="avatar"
                      Icon={FaUser}
                      picture={
                        avatar && {
                          src: avatar,
                          alt: getFullName(user.name),
                        }
                      }
                      listProps={{ className: 'top-100 mt-2' }}
                      btnProps={{
                        variant: 'secondary',
                        title: 'Profile',
                        className: avatar ? 'p-0' : 'p-1',
                      }}>
                      <ListGroup.Item
                        action
                        active={location.pathname === `/users/${user._id}`}
                        className="text-nowrap p-0">
                        <Nav.Link
                          as={NavLink}
                          eventKey="profile"
                          to={`users/${user._id}`}
                          className="d-block text-reset fs-5 px-4 py-2">
                          {getFullName(user.name)}
                        </Nav.Link>
                      </ListGroup.Item>
                      <ListGroup.Item
                        action
                        onClick={logoutUser}
                        className="fs-5 px-4 text-nowrap">
                        <Nav.Link
                          as="span"
                          eventKey="logout"
                          className="text-reset p-0">
                          Logout
                        </Nav.Link>
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
              <SearchForm onSubmit={handleSubmit} />
            </Stack>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Navigation;
